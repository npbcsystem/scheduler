
import express from "express";

import {
  getCurrentAndNextSchedules,
} from "../controllers/integrationController.js";

const router = express.Router();

router.get(
  "/schedules/current-and-next",
  getCurrentAndNextSchedules
);

export default router;
