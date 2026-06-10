import express from "express";

import {
  createProgress,
  getProgress,
  addCompletedCourse
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/", createProgress);

router.get("/", getProgress);

router.put(
  "/:id/add-course",
  addCompletedCourse
);

export default router;