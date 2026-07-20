import express from "express";
import mongoose from "mongoose";
import { readdir, rm } from "node:fs/promises";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import User from "../models/UserModel.js";
import { deleteFromS3 } from "../config/s3Service.js";

export const getdir = async (req, res) => {
  const { id } = req.params;
  const { type } = req.headers;
  const { sid } = req.signedCookies;

  const session = req.session;
  const userid = new mongoose.Types.ObjectId(session.userid);
  const usertoverify = await User.findById(userid);

  if (!usertoverify.isVerified) {
    res.clearCookie("sid");
    return res.status(400).json({ message: "authorized" });
  }
  const files1 = await file.find({
    userid: userid,
    favorites: true,
    isDeleted: false,
  });
  const stats = await file.aggregate([
    { $match: { userid, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalSize: { $sum: "$size" },
        totalFiles: { $sum: 1 },
      },
    },
  ]);

  const totalSize = stats[0]?.totalSize || 0;
  const totalFiles = stats[0]?.totalFiles || 0;
  const totalFolders = await directory.countDocuments({ userid, name: { $ne: "root" } });
  if (type == "Favorites") {
    const files = await file.find({
      userid: userid,
      favorites: true,
      isDeleted: false,
    });
    const username = await User.findById(userid);
    if (sid) {
      return res.json({
        files: files,
        path: ["images"],
        totalSize,
        totalFiles,
        totalFolders,
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
        plan: username.plan,
        storageLimit: username.storageLimit || 200 * 1024 * 1024,
      });
    }
  }
  if (type == "Recent") {
    const files = await file
      .find({ userid: userid, isDeleted: false })
      .sort({ lastAccessed: -1 });

    const username = await User.findById(userid);
    if (sid) {
      return res.json({
        files: files,
        totalSize,
        totalFiles,
        totalFolders,
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
        plan: username.plan,
        storageLimit: username.storageLimit || 200 * 1024 * 1024,
      });
    }
  }
  if (type == "dashboard") {
    const files = await file
      .find({ userid: userid, isDeleted: false })
      .sort({ lastAccessed: -1 });

    const username = await User.findById(userid);
    if (sid) {
      return res.json({
        files: files,
        favorites: files1,
        totalSize,
        totalFiles,
        totalFolders,
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
        plan: username.plan,
        storageLimit: username.storageLimit || 200 * 1024 * 1024,
      });
    }
  }
  if (type == "Trash") {
    const files = await file
      .find({ userid: userid, isDeleted: true })
      .sort({ lastAccessed: -1 });

    const filesWithPath = await Promise.all(
      files.map(async (data) => {
        let current = await directory.findOne({
          userid: userid,
          _id: data.parentid,
        });

        let path = [];

        while (current) {
          path.unshift({ name: current.name, id: current._id });
          if (!current.parentid) break;

          current = await directory.findOne({ _id: current.parentid });
        }

        return {
          ...data.toObject(), 
          path: path,
        };
      }),
    );
    const username = await User.findById(userid);
    if (sid) {
      return res.json({
        files: filesWithPath,
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
        plan: username.plan,
        totalSize,
        totalFiles,
        totalFolders,
        storageLimit: username.storageLimit || 200 * 1024 * 1024,
      });
    }
  }

  let parentid;
  if (id != "root") {
    parentid = await directory.findOne({ userid: userid, _id: id });
  } else {
    parentid = await directory.findOne({ userid: userid, name: "root" });
  }
  if (parentid) {
    const files = await file.find({ parentid: parentid.id, isDeleted: false });
    const folders = await directory.find({ parentid: parentid.id });
    const username = await User.findById(userid);

    let current = parentid;
    let path = [];
    while (current) {
      path.unshift({ name: current.name, id: current._id });
      if (!current.parentid) break;

      current = await directory.findOne({ _id: current.parentid });
    }

    if (req.signedCookies) {
      res.json({
        files: files,
        folder: folders,
        currentfolder: parentid.name,
        path: path,
        totalSize,
        totalFiles,
        totalFolders,
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
        plan: username.plan,
        storageLimit: username.storageLimit || 200 * 1024 * 1024,
      });
    }
  } else {
    return res.status(400).json({ message: "authorized" });
  }
}

export const postdir = async (req, res) => {
  const { id } = req.params;
  const sesion = req.session;
  const userid = sesion.userid;
  const { foldername } = req.body;

  if (id != "root") {
    await directory.insertOne({
      name: foldername,
      userid: userid,
      parentid: id,
    });
  } else {
    const parent = await directory.findOne({ userid: userid, name: "root" });
    await directory.insertOne({
      name: foldername,
      userid: userid,
      parentid: parent.id,
    });
  }

  res.json("folder created");
}

export const patchdir = async (req, res) => {
  const { id } = req.params;
  const { newfoldername } = req.body;

  await directory.updateOne({ _id: id }, { $set: { name: newfoldername } });
  res.json("done");
}

export const deletedir = async (req, res, next) => {
  const { id } = req.params;
  const sesion = req.session;
  const userid = sesion.userid;
  const directoryData = await directory.findOne(
    {
      _id: id,
      userid: userid,
    },
    "_id",
  );

  if (!directoryData) {
    return res.status(404).json({ error: "Directory not found!" });
  }

  async function getDirectoryContents(id) {
    let files = await file.find({ parentid: id }, "ext");

    let directories = await directory.find({ parentid: id }, "id");

    for (const { _id, name } of directories) {
      const { files: childFiles, directories: childDirectories } =
        await getDirectoryContents(_id);

      files = [...files, ...childFiles];
      directories = [...directories, ...childDirectories];
    }

    return { files, directories };
  }

  const { files, directories } = await getDirectoryContents(id);

  for (const { _id, ext } of files) {
    try {
      await deleteFromS3(`${_id}${ext}`);
    } catch (err) {
      console.warn(`S3 delete failed for key ${_id}${ext} during directory cleanup:`, err);
    }
  }

  await file.deleteMany({
    _id: { $in: files.map(({ _id }) => _id) },
  });

  await directory.deleteMany({
    _id: { $in: [...directories.map(({ _id }) => _id), id] },
  });

  return res.json({ message: "Files deleted successfully" });
}