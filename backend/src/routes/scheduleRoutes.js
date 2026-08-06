import express from "express";

import { generate, getSchedules, updateSchedule } from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);

router.get("/generate/:week", generate);

router.put("/:id", updateSchedule);

export default router;
