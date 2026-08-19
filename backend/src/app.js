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

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/courses", courseRoutes);
app.use("/api/branches", branchRoutes);
app.use("/api/lecturers", lecturerRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/pending-assignments", pendingAssignmentRoutes);

app.use("/api/sms", smsRoutes);
app.use("/api/notifications", notificationRoutes);
// app.use("/api/import", importRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "NPBC Scheduler API",
  });
});

app.use("/api/test", testRoutes);

export default app;
