import express from "express";
import "./config/db.js";
import { connectRedis, getCachedSession } from "./config/redisService.js";
await connectRedis();
import './service/Sendotp.js'
import './service/googleAuthService.js'
import './service/Cronautodelete.js'
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import cookieParser from "cookie-parser";
import directoryroute from "./routes/directoryroute.js";
import fileroute from "./routes/fileroute.js";
import subscriptionrouter from "./routes/subscriptionrouter.js";
import "./models/directorymodel.js";
import "./models/filemodel.js";
import userauth from "./middlewares/userauth.js";
import Session from "./models/SessionModel.js";
import User from "./models/UserModel.js";
import file from "./models/filemodel.js";
import path from "path";
import helmet from "helmet";
import { getPresignedDownloadUrl } from "./config/s3Service.js";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }),
);

// Webhook endpoint mounted with express.raw to preserve raw body signature validation
import webhookrouter from "./routes/webhookrouter.js";
app.use("/webhooks", express.raw({ type: "application/json" }), webhookrouter);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(express.urlencoded({ extended: true }));

app.use("/user", UserRoute);

app.get("/checklogin", async (req, res) => {
  const { sid } = req.signedCookies;
  if (!sid) {
    return res.json("not login");
  }
  try {
    const session = await getCachedSession(sid);
    if (!session) {
      return res.json("not login");
    }
    const userid = session.userid;
    if (userid) {
      const usertoverify = await User.findById(userid);
      if (usertoverify?.isVerified) {
        return res.json("already login");
      }
    }
  } catch (err) {
    console.error("Checklogin error:", err);
  }
  res.json("not login");
});

app.use("/directory", userauth, directoryroute);

app.use("/file", userauth, fileroute);

app.use("/subscription", subscriptionrouter);

app.get("/share/:shareId", async (req, res) => {
  const { shareId } = req.params;

  const fileData = await file.findOne({
    shareId,
    isShared: true,
  });

  if (!fileData) return res.status(404).send("Invalid link");

  // Generate presigned S3 GET URL
  try {
    const s3Key = `${fileData.id}${fileData.ext}`;
    const s3Url = await getPresignedDownloadUrl(s3Key, fileData.name, "view");
    res.redirect(s3Url);
  } catch (err) {
    console.error("Error generating shared S3 download URL:", err);
    res.status(500).send("Internal server error");
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server started on PORT:${PORT}`);
});
