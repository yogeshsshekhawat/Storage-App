import express from "express";
import "./config/db.js";
import './service/Sendotp.js'
import './service/googleAuthService.js'
import './service/Cronautodelete.js'
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import directoryroute from "./routes/directoryroute.js";
import fileroute from "./routes/fileroute.js";
import "./models/directorymodel.js";
import "./models/filemodel.js";
import userauth from "./middlewares/userauth.js";
import Session from "./models/SessionModel.js";
import User from "./models/UserModel.js";
import file from "./models/filemodel.js";
import path from "path";
import helmet from "helmet";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute);

app.get("/checklogin", async (req, res) => {
  const { sid } = req.signedCookies;
  const session = await Session.findById(sid);
  const userid = session.userid;
  const usertoverify = await User.findById(userid);
  if (usertoverify?.isVerified) {
    return res.json("already login");
  }
  res.end();
});

app.use("/directory", userauth, directoryroute);

app.use("/file", userauth, fileroute);

app.get("/share/:shareId", async (req, res) => {
  const { shareId } = req.params;

  const fileData = await file.findOne({
    shareId,
    isShared: true,
  });

  if (!fileData) return res.status(404).send("Invalid link");

  // // Optional expiry check
  // if (
  //   fileData.shareExpiresAt &&
  //   new Date() > fileData.shareExpiresAt
  // ) {
  //   return res.status(403).send("Link expired");
  // }

  res.sendFile(
    path.resolve(`./public/${fileData.id}${fileData.ext}`)
  );
});

app.listen(3000, () => {
  console.log("server started on PORT:3000");
});
