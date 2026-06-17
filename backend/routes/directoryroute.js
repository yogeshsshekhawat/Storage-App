import express from "express";
import { readdir, rm } from "node:fs/promises";
import file from "../models/filemodel.js";
import directory from "../models/directorymodel.js";
import validate from "../middlewares/validate.js";
import Session from "../models/SessionModel.js";
import User from "../models/UserModel.js";
import { deletedir, getdir, patchdir, postdir } from "../controllers/directoryController.js";

const router = express.Router();

router.get("/:id", getdir);

router.post("/:id", validate, postdir);

router.patch("/:id", validate, patchdir);

router.delete("/:id", validate, deletedir);

export default router;
