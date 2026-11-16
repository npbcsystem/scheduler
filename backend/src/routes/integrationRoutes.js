
import express from "express";

import {
  getCurrentAndNextSchedules,
  getIntegrationLecturers,
} from "../controllers/integrationController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/lecturers", protect, getIntegrationLecturers);
router.get("/lecturers/integration", getIntegrationLecturers);

router.get(
  "/schedules/current-and-next",
  getCurrentAndNextSchedules
);

export default router;
