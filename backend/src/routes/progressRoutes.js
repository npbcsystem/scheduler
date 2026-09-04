import express from "express";

import {
  createProgress,
  getProgress,
  addCompletedCourse,
  addCompletedCourses,
  getRemainingCourses,
  getBranchProgress,
  removeCompletedCourse,
  removeCompletedCourses,
} from "../controllers/progressController.js";

const router = express.Router();

router.post("/", createProgress);

router.get("/", getProgress);

router.put("/:id/add-course", addCompletedCourse);

router.get("/:branchId/:level/remaining", getRemainingCourses);

router.get("/branch/:branchId", getBranchProgress);

router.put("/:id/remove-course", removeCompletedCourse);

router.put(
  "/:id/add-courses",
  addCompletedCourses
);

router.put(
  "/:id/remove-courses",
  removeCompletedCourses
);

export default router;
