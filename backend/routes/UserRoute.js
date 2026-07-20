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
import { userGoogleregister, userLogin, userLogout, userProfile, userRegister, userSession, userVerifyemail, userUpdateProfile, userDeleteAccount, userChangePassword } from "../controllers/userController.js";

const router = express.Router();

router.post("/session", userSession);
router.post("/register", userRegister );

router.post("/login", userLogin);

router.post("/logout", userLogout );

router.get("/profile", userProfile );

router.post("/verifyemail", userVerifyemail );

router.post("/googleregister", userGoogleregister);
router.post("/update-profile", userUpdateProfile);
router.post("/delete-account", userDeleteAccount);
router.post("/change-password", userChangePassword);

export default router;
