import express from "express";
import { generateSchedule } from "../services/schedulerService.js";

const router = express.Router();

router.post("/generate", async (req, res) => {
  const { dates } = req.body;

  await generateSchedule(dates);

  res.json({ message: "Schedule generated" });
});

export default router;