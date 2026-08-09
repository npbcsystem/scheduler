import express from "express";

import {
    getPendingAssignments,
    assignPendingAssignment
} from "../controllers/pendingAssignmentController.js";

const router = express.Router();

router.get("/", getPendingAssignments);

router.post("/:id/assign", assignPendingAssignment);

export default router;