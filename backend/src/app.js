import express from "express";
import cors from "cors";

import testRoutes from "./routes/testRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import lecturerRoutes from "./routes/lecturerRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import pendingAssignmentRoutes from "./routes/pendingAssignmentRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import protect from "./middleware/authMiddleware.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/courses", protect, courseRoutes);
app.use("/api/branches", protect, branchRoutes);
app.use("/api/lecturers", protect, lecturerRoutes);
app.use("/api/progress", protect, progressRoutes);
app.use("/api/schedule", protect, scheduleRoutes);
app.use("/api/pending-assignments", protect, pendingAssignmentRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/sms", protect, smsRoutes);
app.use("/api/notifications", protect, notificationRoutes);
// app.use("/api/import", importRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "NPBC Scheduler API",
  });
});

app.use("/api/test", testRoutes);

export default app;
