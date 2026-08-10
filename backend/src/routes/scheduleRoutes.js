import express from "express";

import {
  generate,
  getSchedules,
  updateSchedule,
  approveWeek,
  approveAll,
  completeWeek,
  completeMonth,
} from "../controllers/scheduleController.js";

const router = express.Router();

// Get schedules
router.get("/", getSchedules);

// Generate schedule
router.get("/generate/:week", generate);

// Update schedule
router.put("/:id", updateSchedule);

// Approve specific week
router.put("/approve/week/:week", approveWeek);

// Approve all
router.put("/approve/all", approveAll);

// Complete specific week
router.put("/complete/week/:week", completeWeek);

router.put("/complete/month/:month", completeMonth);

export default router;
