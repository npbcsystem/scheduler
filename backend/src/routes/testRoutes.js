import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Models ready"
  });
});

export default router;