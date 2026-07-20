import express from "express";
import upload from "../middleware/upload.js";
import { importBranches } from "../controllers/importController.js";

const router = express.Router();

router.post(
    "/branches",
    upload.single("file"),
    importBranches
);

export default router;