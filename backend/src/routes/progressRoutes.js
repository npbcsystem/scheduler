import express from "express";

import {
  createProgress,
  getProgress,
  addCompletedCourse,
  getRemainingCourses,
  getBranchProgress,
  removeCompletedCourse,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/", createProgress);

router.get("/", getProgress);

router.put("/:id/add-course", addCompletedCourse);

router.get("/:branchId/:level/remaining", getRemainingCourses);

router.get("/branch/:branchId", getBranchProgress);

router.put("/:id/remove-course", removeCompletedCourse);

export default router;
