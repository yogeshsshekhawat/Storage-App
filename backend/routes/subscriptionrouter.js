import express from "express";
import crypto from "crypto";
import razorpay from "../service/razorpay.js";
import User from "../models/UserModel.js";
import userauth from "../middlewares/userauth.js";
import Subscription from "../models/SubscriptionModel.js";
import file from "../models/filemodel.js";


const router = express.Router();

// Map Razorpay plan IDs to internal plan names
const PLAN_IDS = {
  [process.env.RAZORPAY_PLAN_ID_PRO]: "Pro",
  [process.env.RAZORPAY_PLAN_ID_ENTERPRISE]: "Enterprise"
};

const PLANS = {
  "Basic": { price: 0, limit: 200 * 1024 * 1024 },
  "Pro": { price: 299, limit: 200 * 1024 * 1024 * 1024, id: process.env.RAZORPAY_PLAN_ID_PRO },
  "Enterprise": { price: 599, limit: 1024 * 1024 * 1024 * 1024, id: process.env.RAZORPAY_PLAN_ID_ENTERPRISE }
};

// Helper to cancel a subscription immediately (bypassing Node SDK limitations)
async function cancelSubscriptionImmediately(subscriptionId) {
  if (!subscriptionId) return;
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  const response = await fetch(`https://api.razorpay.com/v1/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      cancel_at_cycle_end: 0 // Force immediate cancellation
    })
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Razorpay API cancel failed: ${errorText}`);
  }
  return await response.json();
}

// Protect all subscription endpoints
router.use(userauth);

// 1. Create a Subscription (or setup prorated upgrade order)
router.post("/create", async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ error: "planId is required" });
    }

    const session = req.session;
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userdata = await User.findById(session.userid);
    if (!userdata) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if upgrading or downgrading from an active plan
    const activeSub = await Subscription.findOne({
      userId: session.userid,
      status: { $in: ["created", "authenticated", "active", "paid"] }
    }).sort({ createdAt: -1 }); // Get the most recent subscription

    if (activeSub && userdata.plan !== "Basic") {
      console.log(`Active subscription found: ${activeSub.subscriptionId}, status: ${activeSub.status}, plan: ${activeSub.planName}`);
      const oldPrice = PLANS[userdata.plan]?.price || 299;
      const newPlanKey = PLAN_IDS[planId] || "Pro";
      const newPrice = PLANS[newPlanKey]?.price || 599;

      // Handle Downgrade Logic (schedule change at cycle end)
      if (newPrice < oldPrice) {
        const stats = await file.aggregate([
          { $match: { userid: session.userid, isDeleted: { $ne: true } } },
          { $group: { _id: null, totalSize: { $sum: "$size" } } },
        ]);
        const currentTotalSize = stats[0]?.totalSize || 0;
        const targetLimit = PLANS[newPlanKey].limit;
        if (currentTotalSize > targetLimit) {
          const excess = currentTotalSize - targetLimit;
          const excessGB = (excess / (1024 * 1024 * 1024)).toFixed(2);
          return res.status(400).json({
            error: `Your storage usage exceeds the ${newPlanKey} plan limit by ${excessGB} GB. Please delete files before downgrading.`
          });
        }

        try {
          const oldSub = await razorpay.subscriptions.fetch(activeSub.subscriptionId);

          // 1. Create the new subscription scheduled to start when the current cycle ends
          const nextSubscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 12,
            quantity: 1,
            start_at: oldSub.current_end,
          });

          // 2. Set the old subscription to cancel at cycle end (using direct REST call to bypass SDK bug)
          const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
          await fetch(`https://api.razorpay.com/v1/subscriptions/${activeSub.subscriptionId}/cancel`, {
            method: "POST",
            headers: {
              "Authorization": `Basic ${auth}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              cancel_at_cycle_end: 1 // Cancel at cycle end
            })
          });

          // 3. Save subscription details in database
          await Subscription.create({
            subscriptionId: nextSubscription.id,
            userId: session.userid,
            status: "created",
            planId: planId,
            planName: newPlanKey,
            type: "new",
          });

          // 4. Update database: save pending plan and downgrade date
          await User.findByIdAndUpdate(session.userid, {
            pendingPlan: newPlanKey,
            downgradeAt: new Date(oldSub.current_end * 1000),
          });

          return res.status(200).json({
            type: "downgrade-scheduled",
            plan: newPlanKey,
            message: `Your downgrade to ${newPlanKey} plan has been scheduled. It will take effect on your renewal date: ${new Date(oldSub.current_end * 1000).toLocaleDateString()}`
          });
        } catch (downgradeErr) {
          console.error("Downgrade scheduling failed:", downgradeErr.message);
          return res.status(500).json({ error: "Failed to schedule downgrade." });
        }
      }

      // Handle Upgrade Logic using manual proration
      // (Razorpay's native subscriptions.update() with schedule_change_at: "now"
      //  does not work in India due to RBI e-mandate on both UPI and cards)
      try {
        const oldSub = await razorpay.subscriptions.fetch(activeSub.subscriptionId);
        const now = Math.floor(Date.now() / 1000);
        const totalDuration = oldSub.current_end - oldSub.current_start;
        const remainingTime = oldSub.current_end - now;

        if (remainingTime > 3600 && totalDuration > 0) {
          const totalDaysInMonth = totalDuration / (24 * 60 * 60);
          const remainingDays = remainingTime / (24 * 60 * 60);
          const credit = (remainingDays / totalDaysInMonth) * oldPrice;
          let amountDueToday = newPrice - credit;

          if (amountDueToday <= 1) amountDueToday = 1;
          const upfrontAmountInPaise = Math.round(amountDueToday * 100);

          console.log(`Proration upgrade calculation:
            - Old Plan Price: ₹${oldPrice}
            - New Plan Price: ₹${newPrice}
            - Total days in month: ${totalDaysInMonth.toFixed(2)}
            - Remaining days: ${remainingDays.toFixed(2)}
            - Unused Credit: ₹${credit.toFixed(2)}
            - Amount Due Today: ₹${amountDueToday.toFixed(2)} (${upfrontAmountInPaise} paise)`);

          // Cancel the old subscription immediately
          try {
            console.log(`Cancelling old subscription ${activeSub.subscriptionId} immediately for upgrade...`);
            await cancelSubscriptionImmediately(activeSub.subscriptionId);
            activeSub.status = "cancelled";
            await activeSub.save();
          } catch (err) {
            console.warn("Could not cancel old subscription immediately on Razorpay during upgrade:", err.message);
          }

          // Create new subscription with prorated upfront amount
          const nextSubscription = await razorpay.subscriptions.create({
            plan_id: planId,
            customer_notify: 1,
            total_count: 12,
            quantity: 1,
            start_at: oldSub.current_end,
            upfront_amount: upfrontAmountInPaise,
          });

          await Subscription.create({
            subscriptionId: nextSubscription.id,
            userId: session.userid,
            status: "created",
            planId: planId,
            planName: newPlanKey,
            type: "upgrade"
          });

          return res.status(200).json({
            type: "upgrade",
            subscriptionId: nextSubscription.id,
            user: {
              name: userdata.name,
              email: userdata.email
            }
          });
        }
      } catch (err) {
        console.warn("Prorated update calculation failed, falling back to new subscription:", err);
      }
    }

    // Standard new subscription creation
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // 12 billing cycles
      quantity: 1,
    });

    const planKey = PLAN_IDS[planId] || "Pro";
    await Subscription.create({
      subscriptionId: subscription.id,
      userId: session.userid,
      status: "created",
      planId: planId,
      planName: planKey,
      type: "new",
    });

    res.status(201).json({
      subscriptionId: subscription.id,
      entity: subscription.entity,
      status: subscription.status,
      plan_id: subscription.plan_id,
      user: {
        name: userdata.name,
        email: userdata.email
      }
    });
  } catch (error) {
    console.error("Error creating Razorpay subscription:", error);
    res.status(500).json({ error: error.message || "Failed to create subscription" });
  }
});

// 2. Downgrade user to free plan
router.post("/downgrade-free", async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const stats = await file.aggregate([
      { $match: { userid: session.userid, isDeleted: { $ne: true } } },
      { $group: { _id: null, totalSize: { $sum: "$size" } } },
    ]);
    const currentTotalSize = stats[0]?.totalSize || 0;
    const targetLimit = PLANS.Basic.limit;
    if (currentTotalSize > targetLimit) {
      const excess = currentTotalSize - targetLimit;
      const excessGB = (excess / (1024 * 1024 * 1024)).toFixed(2);
      return res.status(400).json({
        error: `Your storage usage exceeds the Basic plan limit by ${excessGB} GB. Please delete files before downgrading.`
      });
    }

    // Cancel old active subscription immediately in Razorpay and DB
    const activeSub = await Subscription.findOne({
      userId: session.userid,
      status: { $in: ["created", "authenticated", "active", "paid"] }
    });

    if (activeSub) {
      try {
        await cancelSubscriptionImmediately(activeSub.subscriptionId);
        activeSub.status = "cancelled";
        await activeSub.save();
      } catch (err) {
        console.warn("Could not cancel subscription during downgrade:", err);
      }
    }

    // Revert user to free plan and reset storageLimit
    await User.findByIdAndUpdate(session.userid, {
      plan: "Basic",
      storageLimit: PLANS.Basic.limit,
      pendingPlan: null,
      downgradeAt: null,
    });

    res.status(200).json({ status: "success", plan: "Basic" });
  } catch (error) {
    console.error("Error downgrading subscription:", error);
    res.status(500).json({ error: "Failed to downgrade plan" });
  }
});

// 3. Verify a Subscription payment and update User plan synchronously
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature, planName } = req.body;
    if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing required verification fields" });
    }

    const session = req.session;
    const userid = session.userid;

    // Verify signature using Razorpay secret
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Update Subscription in DB
    const dbSub = await Subscription.findOne({ subscriptionId: razorpay_subscription_id });
    if (dbSub) {
      dbSub.status = "active";
      dbSub.razorpayPaymentId = razorpay_payment_id;
      await dbSub.save();
    }

    // Determine target plan limit
    const pName = planName || dbSub?.planName || "Pro";
    const limitBytes = PLANS[pName]?.limit || PLANS.Basic.limit;

    // Update User plan and storageLimit in DB
    await User.findByIdAndUpdate(userid, {
      plan: pName,
      storageLimit: limitBytes,
      pendingPlan: null,
      downgradeAt: null,
    });

    console.log(`User ${userid} plan verified and updated synchronously to ${pName} (${limitBytes} bytes).`);
    res.status(200).json({ status: "success", plan: pName, storageLimit: limitBytes });
  } catch (err) {
    console.error("Error verifying Razorpay subscription:", err);
    res.status(500).json({ error: "Failed to verify subscription" });
  }
});

export default router;
