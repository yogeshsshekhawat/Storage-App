import express from "express";
import Session from "../models/SessionModel.js";
import directory from "../models/directorymodel.js";
import file from "../models/filemodel.js";
import { deleteFromS3 } from "../config/s3Service.js";
import Subscription from "../models/SubscriptionModel.js";
import bcrypt from "bcrypt";
import user from "../models/UserModel.js";
import Otp from "../models/OtpModel.js";
import sendotp from "../service/Sendotp.js";
import { verifyIdToken } from "../service/googleAuthService.js";
import z from "zod";
import { registerSchema } from "../validator/Zod_Validator.js";
import { setCachedSession, deleteCachedSession, getCachedSession } from "../config/redisService.js";


export const userSession = async (req, res) => {
  const { sid } = req.signedCookies;
  if (!sid) {
    const newsession = await Session.create({});
    await setCachedSession(newsession._id, newsession);
    res.cookie("sid", newsession._id, {
      signed: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.end();
  }
  const session = await getCachedSession(sid);

  if (!session) {
    const newsession = await Session.create({});
    await setCachedSession(newsession._id, newsession);
    res.cookie("sid", newsession._id, {
      signed: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  if (session?.userid) {
    return res.json("already login");
  }

  res.end();
}

export const userRegister = async (req, res) => {
  // const { name } = req.body;
  // const { email } = req.body;
  // const { password } = req.body;
  const { success, data, error } = registerSchema.safeParse(req.body)

  if (!success) {
    return res.status(400).json({ error: "invalid credentials" });
  }
  const { name, email, password } = data;
  const { sid } = req.signedCookies;
  const usersession = await getCachedSession(sid);

  if (usersession?.userid) {
    return res.json("already login");
  }

  const a = await user.create({ name, email, password });
  const b = await directory.create({ name: "root", userid: a._id });
  
  let session;
  if (sid) {
    session = await Session.findByIdAndUpdate(
      sid,
      { userid: a._id },
      { new: true },
    );
  }
  if (!session) {
    session = await Session.create({ userid: a._id });
  }
  if (session) {
    await setCachedSession(session._id, session);
  }
  const otp = Math.floor(100000 + Math.random() * 900000);

  await Otp.create({ userid: a._id, otp });

  await sendotp(email, otp);

  res.cookie("sid", session._id, {
    signed: true,
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json("registerd");
}

export const userLogin = async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const { sid } = req.signedCookies;
  const a = await user.findOne({ email });
  if (a) {
    const pass = await bcrypt.compare(password, a.password);
    if (pass) {
      let session;
      if (sid) {
        session = await Session.findByIdAndUpdate(sid, { userid: a._id }, { new: true });
      }
      if (!session) {
        session = await Session.create({ userid: a._id });
      }
      if (session) {
        await setCachedSession(session._id, session);
      }

      // Ensure root directory exists
      const rootDir = await directory.findOne({ userid: a._id, name: "root" });
      if (!rootDir) {
        await directory.create({ name: "root", userid: a._id });
      }

      res.cookie("sid", session._id, {
        signed: true,
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json("registerd");
    } else {
      res.status(400).json({ error: "invalid credentials" });
    }
  } else {
    res.status(400).json({ error: "invalid credentials" });
  }
}

export const userLogout = async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid);
  await deleteCachedSession(sid);
  res.clearCookie("sid");

  res.json("logout done");
}

export const userProfile = async (req, res) => {
  const { id } = req.cookies;
  const userdata = await user.findById(id);
  console.log(userdata);
  res.json({ name: `${userdata.name}`, email: `${userdata.email}` });
}

export const userVerifyemail = async (req, res) => {
  const { sid } = req.signedCookies;
  let session;
  if (sid) {
    session = await getCachedSession(sid);
  }
  if (!session) {
    return res.status(401).json("Unauthorized: Session not found");
  }
  const userid = session.userid;
  const { otp: inputopt } = req.body;
  const otp = await Otp.findOne({ userid });
  if (!otp) {
    return res.json("recent otp");
  }
  if (otp.otp == inputopt) {
    await user.findOneAndUpdate(
      {
        _id: userid,
        isVerified: false,
      },
      {
        $set: { isVerified: true },
        $unset: { unverifiedExpiresAt: 1 },
      },
    );
    res.status(200).json("correct");
  } else {
    res.status(400).json("incorrect");
  }
}

export const userGoogleregister = async (req, res) => {
  const { credential } = req.body;
  const userdata = await verifyIdToken(credential);
  const { email, name, picture } = userdata;
  const { sid } = req.signedCookies;
  const User = await user.findOne({ email });
  if (User) {
    let session;
    if (sid) {
      session = await Session.findByIdAndUpdate(sid, { userid: User._id }, { new: true });
    }
    if (!session) {
      session = await Session.create({ userid: User._id });
    }
    await setCachedSession(session._id, session);

    // Ensure root directory exists
    const rootDir = await directory.findOne({ userid: User._id, name: "root" });
    if (!rootDir) {
      await directory.create({ name: "root", userid: User._id });
    }

    res.cookie("sid", session._id, {
      signed: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json("register");
  } else {
    const newuser = await user.create({
      name,
      email,
      profilepic: picture,
      isVerified: true,
    });
    const b = await directory.create({ name: "root", userid: newuser._id });
    let session;
    if (sid) {
      session = await Session.findByIdAndUpdate(
        sid,
        { userid: newuser._id },
        { new: true },
      );
    }
    if (!session) {
      session = await Session.create({ userid: newuser._id });
    }
    await setCachedSession(session._id, session);
    res.cookie("sid", session._id, {
      signed: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json("register");
  }
}

export const userUpdateProfile = async (req, res) => {
  const { name } = req.body;
  const { sid } = req.signedCookies;

  if (!sid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const session = await getCachedSession(sid);
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updatedUser = await user.findByIdAndUpdate(
      session.userid,
      { $set: { name } },
      { new: true }
    );

    res.json({ message: "Profile updated successfully", user: { name: updatedUser.name } });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
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
    console.error(`Razorpay API cancel failed for sub ${subscriptionId}: ${errorText}`);
  }
}

export const userDeleteAccount = async (req, res) => {
  const { sid } = req.signedCookies;
  if (!sid) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const session = await getCachedSession(sid);
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userid = session.userid;

    // 1. Find and cancel all active subscriptions in Razorpay
    const userSubscriptions = await Subscription.find({ userId: userid });
    for (const sub of userSubscriptions) {
      if (sub.subscriptionId) {
        try {
          await cancelSubscriptionImmediately(sub.subscriptionId);
          console.log(`Cancelled Razorpay subscription: ${sub.subscriptionId}`);
        } catch (razorpayErr) {
          console.error(`Failed to cancel Razorpay subscription ${sub.subscriptionId}:`, razorpayErr);
        }
      }
    }

    // 2. Delete subscription records from DB
    await Subscription.deleteMany({ userId: userid });

    // 3. Find all files of that user
    const userFiles = await file.find({ userid });

    // 4. Delete each file from AWS S3
    for (const f of userFiles) {
      try {
        const s3Key = `${f._id}${f.ext}`;
        await deleteFromS3(s3Key);
        console.log(`Successfully deleted file from S3: ${s3Key}`);
      } catch (s3Err) {
        console.error(`Failed to delete S3 file ${f._id}${f.ext}:`, s3Err);
      }
    }

    // 3. Delete files and directories records from MongoDB
    await file.deleteMany({ userid });
    await directory.deleteMany({ userid });

    // 4. Delete the user itself
    await user.findByIdAndDelete(userid);

    // 5. Destroy session and clear cookie
    await Session.findByIdAndDelete(sid);
    await deleteCachedSession(sid);
    res.clearCookie("sid");

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("Account deletion error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const userChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { sid } = req.signedCookies;

  if (!sid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const session = await getCachedSession(sid);
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbUser = await user.findById(session.userid);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check current password (if user has set one)
    if (dbUser.password) {
      const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Incorrect current password" });
      }
    }

    // Update new password (mongoose pre-save hook will handle hashing it)
    dbUser.password = newPassword;
    await dbUser.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Password update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
