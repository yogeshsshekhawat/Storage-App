import express from "express";
import fs from "node:fs";
import path from "node:path";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import crypto from "crypto";
import { rm } from "node:fs/promises";
import Session from "../models/SessionModel.js";

export const getfile = async (req, res) => {
  const filename = req.params.path;
  const { action } = req.query;
  const { name } = req.query;
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid);
  const id = sesion.userid;

  const files = await file.findOne({ name: name, userid: id }, "userid");
  if (!files) {
    return res.status(400).json({ message: "file not founded" });
  }
  // console.log(files.userid )
  // console.log(id)
  // console.log(files.userid === id)
  if (files.userid.toString() === id.toString()) {
    if (action == "download") {
      res.setHeader("Content-Disposition", `attachment;filename="${name}"`);
    }
    files.lastAccessed = new Date();
    await files.save();
    res.sendFile(`${process.cwd()}/public/${filename}`);
  } else {
    return res.status(400).json({ message: "authorized" });
  }
}

export const postfile = async (req, res) => {
  const { sid } = req.signedCookies;
  const { dirid } = req.headers;
  const { size } = req.headers;

  const session = await Session.findById(sid);

  const id = session.userid;

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

  const writestream = fs.createWriteStream(`./public/${files.id}${extention}`);
  req.pipe(writestream);

  res.json("uploaded");
}

export const deletefile = async (req, res) => {
  const { path: fileid } = req.params;
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid);
  const id = sesion.userid;
  const { name } = req.headers;
  const { type } = req.headers;
  const extention = path.extname(name);
  const files = await file.findOne({ _id: fileid, userid: id });
  if (files) {
    if (type == "permanentdelete") {
      await file.deleteOne({ _id: fileid, userid: id });
      await rm(`./public/${fileid}${extention}`);
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
  const { sid } = req.signedCookies;
  const sesion = await Session.findById(sid);
  const userid = sesion.userid;
  const {type} = req.headers;
  if(type == 'restore'){
    const File = await file.findByIdAndUpdate(id,{isDeleted:false})
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

      return res.json({
        link: `http://localhost:3000/share/${shareId}`,
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

