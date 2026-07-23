import express from "express";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import crypto from "crypto";
import { rm } from "node:fs/promises";
import User from "../models/UserModel.js";
import { getPresignedUploadUrl, getPresignedDownloadUrl, deleteFromS3 } from "../config/s3Service.js";
import { sendShareEmail } from "../service/Sendotp.js";

export const getfile = async (req, res) => {
  const filename = req.params.path;
  const { action } = req.query;
  const { name } = req.query;
  try {
    const sesion = req.session;
    if (!sesion) return res.status(401).json({ message: "Unauthorized" });
    const id = new mongoose.Types.ObjectId(sesion.userid);
    const userRecord = await User.findById(id);
    const userEmail = userRecord ? userRecord.email.toLowerCase() : "";

    const files = await file.findOne({
      name: name,
      $or: [
        { userid: id },
        { "sharedWith.email": userEmail }
      ]
    });

    if (!files) {
      return res.status(400).json({ message: "file not founded" });
    }

    const hasAccess = files.userid.toString() === id.toString() ||
      (files.sharedWith && files.sharedWith.some(s => s.email.toLowerCase() === userEmail));

    if (hasAccess) {
      files.lastAccessed = new Date();
      await files.save();

      try {

        const s3Url = await getPresignedDownloadUrl(filename, name, action);
        res.redirect(s3Url);
      } catch (err) {
        console.error("Error generating S3 download URL:", err);
        res.status(500).json({ message: "Failed to generate download URL" });
      }
    } else {
      return res.status(400).json({ message: "authorized" });
    }
  } catch (err) {
    console.error("getfile controller error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

export const postfile = async (req, res) => {
  const { dirid } = req.headers;
  const { size } = req.headers;
  const { contenttype } = req.headers;
  const session = req.session;
  const id = new mongoose.Types.ObjectId(session.userid);
  const userRecord = await User.findById(id);

  // Read storage limit directly from User database record, defaulting to 200 MB
  const limitBytes = userRecord?.storageLimit || 200 * 1024 * 1024;

  // Calculate current storage usage
  const stats = await file.aggregate([
    { $match: { userid: id, isDeleted: { $ne: true } } },
    { $group: { _id: null, totalSize: { $sum: "$size" } } },
  ]);
  const currentTotalSize = stats[0]?.totalSize || 0;

  if (currentTotalSize + Number(size) > limitBytes) {
    return res.status(400).json({ message: "insufficient_space" });
  }

  let parentid;
  if (dirid != "root") {
    parentid = await directory.findOne({ userid: id, _id: dirid });
  } else {
    parentid = await directory.findOne({ userid: id, name: "root" });
  }

  const { filename } = req.params;
  const extention = path.extname(filename);
  const files = await file.insertOne({
    name: filename,
    userid: id,
    parentid: parentid.id,
    ext: extention,
    size: size,
  });

  try {
    const s3Key = `${files.id}${extention}`;
    const uploadUrl = await getPresignedUploadUrl(s3Key, contenttype || "application/octet-stream");
    res.json({ uploadUrl, file: files });
  } catch (err) {
    console.error("Error generating presigned URL:", err);
    await file.deleteOne({ _id: files.id });
    res.status(500).json({ message: "Failed to generate upload URL" });
  }
}

export const deletefile = async (req, res) => {
  const { path: fileid } = req.params;
  const sesion = req.session;
  const id = sesion.userid;
  const { name } = req.headers;
  const { type } = req.headers;
  const extention = path.extname(name);
  const files = await file.findOne({ _id: fileid, userid: id });
  if (files) {
    if (type == "permanentdelete") {
      await file.deleteOne({ _id: fileid, userid: id });
      try {
        await deleteFromS3(`${fileid}${extention}`);
      } catch (err) {
        console.warn(`S3 delete failed for key ${fileid}${extention}:`, err);
      }
      return res.json("deleted");
    }

    await file.findByIdAndUpdate(fileid, {
      isDeleted: true,
      deletedExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json("deleted");
  } else {
    res.status(400).json({ message: "authorized" });
  }
}

export const emptyTrash = async (req, res) => {
  try {
    const session = req.session;
    if (!session || !session.userid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const id = new mongoose.Types.ObjectId(session.userid);

    // Find all deleted files for this user
    const deletedFiles = await file.find({ userid: id, isDeleted: true });

    if (deletedFiles.length === 0) {
      return res.json({ message: "Trash is already empty" });
    }

    // Delete from S3 in parallel
    await Promise.all(
      deletedFiles.map(async (f) => {
        try {
          await deleteFromS3(`${f._id}${f.ext}`);
        } catch (err) {
          console.warn(`S3 delete failed for key ${f._id}${f.ext} during emptyTrash:`, err.message);
        }
      })
    );

    // Delete from DB
    await file.deleteMany({ userid: id, isDeleted: true });

    res.json({ message: "Trash emptied successfully" });
  } catch (err) {
    console.error("emptyTrash error:", err);
    res.status(500).json({ error: "Failed to empty trash" });
  }
}


export const patchfile = async (req, res) => {
  const { id } = req.params;
  if (id == "favorite") {
    const { favorite } = req.body;
    const { fileId } = req.body;
    const file1 = await file.findById(fileId);
    if (favorite == 0) {
      file1.favorites = true;
    } else {
      file1.favorites = false;
    }
    await file1.save();
    return res.json(favorite);
  }

  const { newname } = req.headers;
  const sesion = req.session;
  const userid = sesion.userid;
  const { type } = req.headers;
  if (type == 'restore') {
    const File = await file.findByIdAndUpdate(id, { isDeleted: false })
    return res.json('restored')
  }

  const files = await file.find({ _id: id, userid: userid }, "id");
  if (files) {
    await file.updateOne({ _id: id }, { $set: { name: newname } });

    res.json("renamed");
  } else {
    res.status(400).json({ message: "authorized" });
  }
}

export const sharefile = async (req, res) => {
  const { enable } = req.body;
  const { id } = req.params;

  try {
    const fileData = await file.findById(id);

    if (!fileData) return res.status(404).json("File not found");

    if (enable) {
      const shareId = crypto.randomBytes(16).toString("hex");

      fileData.isShared = true;
      fileData.shareId = shareId;


      await fileData.save();

      const backendUrl = req.protocol + "://" + req.get("host");
      return res.json({
        link: `${backendUrl}/share/${shareId}`,
      });
    } else {
      fileData.isShared = false;
      fileData.shareId = null;
      fileData.shareExpiresAt = null;

      await fileData.save();

      return res.json({ message: "Sharing disabled" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Server error");
  }
}

export const searchfiles = async (req, res) => {
  try {
    const { q } = req.query;
    const session = req.session;
    const id = session.userid;

    if (!q) {
      return res.json([]);
    }

    const files = await file.find({
      userid: id,
      isDeleted: { $ne: true },
      name: { $regex: q, $options: "i" },
    });

    const dirs = await directory.find({
      userid: id,
      name: { $regex: q, $options: "i", $ne: "root" },
    });

    const filesWithLabel = files.map(f => ({ ...f.toObject(), type: "file" }));
    const dirsWithLabel = dirs.map(d => ({ ...d.toObject(), type: "directory" }));

    res.json([...dirsWithLabel, ...filesWithLabel]);
  } catch (err) {
    console.error("Search files error:", err);
    res.status(500).json("Server error during search");
  }
};

export const getShareInfo = async (req, res) => {
  const { id } = req.params;
  try {
    const session = req.session;
    if (!session) return res.status(401).json("Unauthorized");

    const fileData = await file.findById(id);
    if (!fileData) return res.status(404).json("File not found");

    if (fileData.userid.toString() !== session.userid.toString()) {
      return res.status(403).json("Forbidden");
    }

    res.json({
      isShared: fileData.isShared,
      shareId: fileData.shareId,
      sharedWith: fileData.sharedWith || []
    });
  } catch (err) {
    console.error("getShareInfo error:", err);
    res.status(500).json("Server error");
  }
};

export const shareWithEmail = async (req, res) => {
  const { email, permission } = req.body;
  const { id } = req.params;
  try {
    const session = req.session;
    if (!session) return res.status(401).json("Unauthorized");
    const currentUserId = session.userid;

    const fileData = await file.findById(id);
    if (!fileData) return res.status(404).json("File not found");

    if (fileData.userid.toString() !== currentUserId.toString()) {
      return res.status(403).json("Forbidden: You do not own this file");
    }

    const targetEmail = email.trim().toLowerCase();
    const currentUser = await User.findById(currentUserId);
    if (currentUser && currentUser.email.toLowerCase() === targetEmail) {
      return res.status(400).json("You cannot share a file with yourself");
    }

    // Safety guard
    fileData.sharedWith = fileData.sharedWith || [];

    const existingShare = fileData.sharedWith.find(s => s.email.toLowerCase() === targetEmail);
    if (existingShare) {
      existingShare.permission = permission || "view";
    } else {
      fileData.sharedWith.push({ email: targetEmail, permission: permission || "view" });
    }

    await fileData.save();

    // Send SMTP Gmail Notification
    const currentUserName = currentUser ? currentUser.name : "A CloudVault User";
    sendShareEmail(currentUserName, targetEmail, fileData.name, permission || "view");

    res.json({ message: `File successfully shared with ${targetEmail}`, sharedWith: fileData.sharedWith });
  } catch (err) {
    console.error("shareWithEmail error:", err);
    res.status(500).json("Server error");
  }
};

export const removeShareEmail = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  try {
    const session = req.session;
    if (!session) return res.status(401).json("Unauthorized");
    const currentUserId = session.userid;

    const fileData = await file.findById(id);
    if (!fileData) return res.status(404).json("File not found");

    if (fileData.userid.toString() !== currentUserId.toString()) {
      return res.status(403).json("Forbidden");
    }

    const targetEmail = email.trim().toLowerCase();

    // Safety guard
    fileData.sharedWith = fileData.sharedWith || [];

    fileData.sharedWith = fileData.sharedWith.filter(s => s.email.toLowerCase() !== targetEmail);

    await fileData.save();
    res.json({ message: "Share removed successfully", sharedWith: fileData.sharedWith });
  } catch (err) {
    console.error("removeShareEmail error:", err);
    res.status(500).json("Server error");
  }
};

export const getSharedFiles = async (req, res) => {
  try {
    const session = req.session;
    if (!session) return res.status(401).json("Unauthorized");
    const currentUser = await User.findById(session.userid);
    if (!currentUser) return res.status(404).json("User not found");

    const sharedFiles = await file.find({
      "sharedWith.email": currentUser.email.toLowerCase(),
      isDeleted: { $ne: true }
    }).populate({ path: "userid", model: "User", select: "name" });

    const filesWithOwner = sharedFiles.map(f => {
      const obj = f.toObject();
      return {
        ...obj,
        ownerName: obj.userid ? obj.userid.name : "Unknown Owner"
      };
    });

    res.json(filesWithOwner);
  } catch (err) {
    console.error("getSharedFiles error:", err);
    res.status(500).json("Server error");
  }
};


