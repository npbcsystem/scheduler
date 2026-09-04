import express from "express";

import {
  testSMS,
} from "../controllers/smsController.js";

const router =
  express.Router();

router.post(
  "/test",
  testSMS
);

export default router;