import express from "express";

import {
  notifyWeekController,
} from "../controllers/notificationController.js";

const router =
  express.Router();

router.post(
  "/week",
  notifyWeekController
);

export default router;