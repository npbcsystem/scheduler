import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/schedule", scheduleRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/scheduler")
  .then(() => console.log("DB Connected"));

app.get("/", (req, res) => {
  res.send("Scheduler API Running");
});

app.listen(5000, () => console.log("Server running on port 5000"));