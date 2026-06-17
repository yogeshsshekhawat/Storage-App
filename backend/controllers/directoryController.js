import express from "express";
import { readdir, rm } from "node:fs/promises";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import validate from "../middlewares/validate.js";
import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";

export const getdir = async (req, res) => {
  const { sid } = req.signedCookies;
  const { id } = req.params;
  const { type } = req.headers;

  const session = await Session.findById(sid);
  const userid = session.userid;
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
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
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
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
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
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
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
          path.unshift(current.name);
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
      path.unshift(current.name);
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
        username: username.name,
        profilepic: username.profilepic,
        useremail: username.email,
      });
    }
  } else {
    return res.status(400).json({ message: "authorized" });
  }
}

export const postdir = async (req, res) => {
  const { id } = req.params;
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid);
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
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid);
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
    await rm(`./public/${_id}${ext}`);
  }

  await file.deleteMany({
    _id: { $in: files.map(({ _id }) => _id) },
  });

  await directory.deleteMany({
    _id: { $in: [...directories.map(({ _id }) => _id), id] },
  });

  return res.json({ message: "Files deleted successfully" });
}