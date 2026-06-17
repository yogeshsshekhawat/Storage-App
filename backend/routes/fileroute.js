import express from "express";
import fs from "node:fs";
import path from "node:path";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import crypto from "crypto";
import { rm } from "node:fs/promises";
import Session from "../models/SessionModel.js";
import { deletefile, getfile, patchfile, postfile, sharefile } from "../controllers/fileController.js";

const router = express.Router();

router.get("/:path", getfile);

router.post("/:filename", postfile);

router.delete("/:path", deletefile );

router.patch("/:id", patchfile);

router.patch("/share/:id", sharefile);

export default router;
