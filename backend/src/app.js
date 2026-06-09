import express from "express";
import cors from "cors";

import testRoutes from "./routes/testRoutes.js";
import branchRoutes from "./routes/branchRoutes.js";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/branches", branchRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "NPBC Scheduler API"
  });
});

app.use("/api/test", testRoutes);

export default app;