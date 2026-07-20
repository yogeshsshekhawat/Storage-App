import cron from "node-cron";
import fs from "fs/promises";
import path from "path";
import File from "../models/filemodel.js";
import { deleteFromS3 } from "../config/s3Service.js";


cron.schedule("0 2 * * *", async () => {
  console.log("🧹 Running cleanup job...");

  try {
    const now = new Date();

    // find expired files
    const expiredFiles = await File.find({
      isDeleted: true,
      deletedExpiresAt: { $lte: now },
    });

    if (expiredFiles.length === 0) {
      console.log("✅ No files to clean");
      return;
    }

    await Promise.all(
      expiredFiles.map(async (file) => {
        try {
          // delete from S3
          await deleteFromS3(`${file._id}${file.ext}`).catch((err) => {
            console.warn(`⚠️ S3 File delete failed during cron: ${file._id}${file.ext}`, err);
          });

          // delete from DB
          await File.findByIdAndDelete(file._id);

          console.log(`✅ Deleted: ${file._id}`);
        } catch (err) {
          console.error(`❌ Error deleting ${file._id}`, err);
        }
      })
    );

    console.log(`🧾 Cleanup done. Deleted ${expiredFiles.length} files.`);
  } catch (err) {
    console.error("❌ Cron job failed:", err);
  }
});