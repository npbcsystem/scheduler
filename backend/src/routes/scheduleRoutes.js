import express from "express";

import {
  generate,
  getSchedules,
  updateSchedule,
    approveWeek,
    approveAll
} from "../controllers/scheduleController.js";

const router = express.Router();

router.get("/", getSchedules);

router.get("/generate/:week", generate);

router.put("/:id", updateSchedule);

router.put("/approve/week/:week", approveWeek);

router.put("/approve/all", approveAll);

export default router;
