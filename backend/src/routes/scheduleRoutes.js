import express from "express";

import { generate, getSchedules } from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);

router.get("/generate/:week", generate);

export default router;
