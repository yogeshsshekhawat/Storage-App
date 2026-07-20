import express from "express";
import fs from "node:fs";
import path from "node:path";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import crypto from "crypto";
import { rm } from "node:fs/promises";
import Session from "../models/SessionModel.js";
import { 
  deletefile, 
  getfile, 
  patchfile, 
  postfile, 
  sharefile, 
  searchfiles, 
  getShareInfo, 
  shareWithEmail, 
  removeShareEmail, 
  getSharedFiles, 
  emptyTrash 
} from "../controllers/fileController.js";

const router = express.Router();

router.get("/search", searchfiles);

router.get("/shared-with-me", getSharedFiles);

router.get("/share-info/:id", getShareInfo);

router.get("/:path", getfile);

router.post("/:filename", postfile);

router.delete("/trash/empty", emptyTrash);

router.delete("/:path", deletefile);

router.patch("/:id", patchfile);

router.patch("/share/:id", sharefile);

router.post("/share-email/:id", shareWithEmail);

router.delete("/share-email/:id", removeShareEmail);

export default router;
