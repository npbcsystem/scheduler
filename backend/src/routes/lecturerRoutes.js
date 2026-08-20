import express from "express";

import {
  createLecturer,
  getLecturers,
  getLecturer,
  updateLecturer,
  deleteLecturer,
  getLecturersByCourse,
  getLecturersByCourseAvailability,
} from "../controllers/lecturerController.js";

const router = express.Router();

router.post("/", createLecturer);

router.get("/", getLecturers);

router.get("/:id", getLecturer);

router.put("/:id", updateLecturer);

router.delete("/:id", deleteLecturer);

router.get("/course/:courseId", getLecturersByCourse);

router.get(
  "/by-course/:courseId/availability",
  getLecturersByCourseAvailability,
);

export default router;
