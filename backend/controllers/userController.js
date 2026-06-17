import express from "express";
import Session from "../models/SessionModel.js";
import directory from "../models/directorymodel.js";
import bcrypt from "bcrypt";
import user from "../models/UserModel.js";
import Otp from "../models/OtpModel.js";
import sendotp from "../service/Sendotp.js";
import { verifyIdToken } from "../service/googleAuthService.js";
import z from "zod";
import { registerSchema } from "../validator/Zod_Validator.js";


export const userSession =  async (req, res) => {
  const { sid } = req.signedCookies;
  if (!sid) {
    const newsession = await Session.create({});
    res.cookie("sid", newsession._id, {
      signed: true,
      sameSite: "none",
      secure: true,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.end();
  }
  const session = await Session.findById(sid);

  if (!session) {
    const newsession = await Session.create({});
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
  const {success,data,error} = registerSchema.safeParse(req.body)

  if(!success){
    res.status(400).json({ error: "invalid credentials" });
  }
  const {name ,email, password } = data;
  const { sid } = req.signedCookies;
  const usersession = await Session.findById(sid);

  if (usersession?.userid) {
    return res.json("already login");
  }

  const a = await user.insertOne({ name, email, password });
  const b = await directory.insertOne({ name: "root", userid: a.id });
  const session = await Session.findByIdAndUpdate(
    sid,
    { userid: a._id },
    { new: true },
  );
  const otp = Math.floor(100000 + Math.random() * 900000);

  await Otp.insertOne({ userid: a.id, otp });

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

export const userLogin  =  async (req, res) => {
  const { email } = req.body;
  const { password } = req.body;
  const { sid } = req.signedCookies;
  const a = await user.findOne({ email });
  const session = await Session.findByIdAndUpdate(sid, { userid: a._id });
  if (a) {
    const pass = await bcrypt.compare(password, a.password);
    if (pass) {
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

export const userLogout =  async (req, res) => {
  const { sid } = req.signedCookies;
  await Session.findByIdAndDelete(sid)
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
  const session = await Session.findById(sid);
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

export const userGoogleregister  = async (req, res) => {
  const { credential } = req.body;
  const userdata = await verifyIdToken(credential);
  const { email, name, picture } = userdata;
  const { sid } = req.signedCookies;
  const User = await user.findOne({ email });
  if (User) {
    const session = await Session.findByIdAndUpdate(sid, { userid: User._id });
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
      profilepic:picture,
      isVerified: true,
    });
    const b = await directory.insertOne({ name: "root", userid: newuser.id });
    const session = await Session.findByIdAndUpdate(
      sid,
      { userid: newuser._id },
      { new: true },
    );
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
