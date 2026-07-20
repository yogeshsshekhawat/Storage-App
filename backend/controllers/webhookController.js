import crypto from "crypto";
import User from "../models/UserModel.js";
import Subscription from "../models/SubscriptionModel.js";

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

export const handleRazorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.error("Webhook verification failed: Missing signature or webhook secret");
      return res.status(400).json({ error: "Missing signature or webhook secret" });
    }

    // Verify signature using the raw body buffer
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body); // req.body is parsed as raw buffer by express.raw
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      console.error("Webhook signature mismatch!");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Parse the raw body buffer to JSON
    const payload = JSON.parse(req.body.toString());
    const event = payload.event;
    console.log(`Razorpay Webhook received event: ${event}`);

    if (event === "subscription.activated" || event === "subscription.charged") {
      const subEntity = payload.payload.subscription.entity;
      const subId = subEntity.id;
      const status = subEntity.status;
      const planId = subEntity.plan_id;
      const planName = PLAN_IDS[planId];
      if (!planName) {
        console.error(`Unknown plan ID received from webhook: ${planId}`);
        return res.status(400).json({ error: "Unknown plan configuration" });
      }
      
      const paymentId = payload.payload.payment?.entity?.id || null;

      // Find the subscription in DB
      const dbSub = await Subscription.findOne({ subscriptionId: subId });
      if (dbSub) {
        dbSub.status = status === "active" ? "paid" : status;
        dbSub.planId = planId;     // Sync with Razorpay's updated plan (critical for upgrades)
        dbSub.planName = planName; // Ensures DB always reflects the actual charged plan
        if (paymentId) {
          dbSub.razorpayPaymentId = paymentId;
        }
        await dbSub.save();

        // Update user plan and storage limit, clear upgrade/downgrade pending states
        const limitBytes = PLANS[planName]?.limit || PLANS.Basic.limit;
        await User.findByIdAndUpdate(dbSub.userId, {
          plan: planName,
          storageLimit: limitBytes,
          pendingPlan: null,
          downgradeAt: null,
        });
        console.log(`User ${dbSub.userId} subscription activated/charged. Plan updated to ${planName}.`);
      } else {
        console.warn(`Subscription ${subId} not found in database for activated/charged event`);
      }
    } 
    
    else if (event === "order.paid") {
      const orderEntity = payload.payload.order.entity;
      const orderId = orderEntity.id;
      const paymentId = payload.payload.payment?.entity?.id || null;

      // Find the upgrade subscription in DB using orderId
      const dbSub = await Subscription.findOne({ orderId: orderId });
      if (dbSub) {
        dbSub.status = "paid";
        if (paymentId) {
          dbSub.razorpayPaymentId = paymentId;
        }
        await dbSub.save();

        // Retrieve user
        const userdata = await User.findById(dbSub.userId);
        if (userdata) {
          // For upgrades, cancel old active subscriptions immediately in Razorpay and database
          const activeSubs = await Subscription.find({
            userId: dbSub.userId,
            subscriptionId: { $ne: dbSub.subscriptionId },
            status: { $in: ["created", "authenticated", "active", "paid"] }
          });

          for (const oldSub of activeSubs) {
            try {
              console.log(`Cancelling old subscription ${oldSub.subscriptionId} for user ${dbSub.userId} due to upgrade`);
              await cancelSubscriptionImmediately(oldSub.subscriptionId);
            } catch (err) {
              console.warn(`Could not cancel old subscription ${oldSub.subscriptionId} on Razorpay during upgrade:`, err.message);
            }
            oldSub.status = "cancelled";
            await oldSub.save();
          }

          // Update user to the upgraded plan and storage limit
          const limitBytes = PLANS[dbSub.planName]?.limit || PLANS.Basic.limit;
          userdata.plan = dbSub.planName;
          userdata.storageLimit = limitBytes;
          userdata.pendingPlan = null;
          userdata.downgradeAt = null;
          await userdata.save();
          console.log(`User ${dbSub.userId} successfully upgraded to ${dbSub.planName} via prorated order.`);
        }
      } else {
        console.warn(`Subscription with Order ID ${orderId} not found in database`);
      }
    } 
    
    else if (event === "subscription.cancelled") {
      const subEntity = payload.payload.subscription.entity;
      const subId = subEntity.id;

      const dbSub = await Subscription.findOne({ subscriptionId: subId });
      if (dbSub) {
        dbSub.status = "cancelled";
        await dbSub.save();

        // Revert user to free/Basic plan and reset storage limit
        await User.findByIdAndUpdate(dbSub.userId, {
          plan: "Basic",
          storageLimit: PLANS.Basic.limit,
          pendingPlan: null,
          downgradeAt: null,
        });
        console.log(`User ${dbSub.userId} subscription cancelled. Plan reverted to Basic.`);
      } else {
        console.warn(`Subscription ${subId} not found in database for cancelled event`);
      }
    }

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("Error processing Razorpay webhook:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
