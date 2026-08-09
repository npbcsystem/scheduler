import mongoose from "mongoose";

const pendingAssignmentSchema = new mongoose.Schema(
  {
    year: Number,

    month: Number,

    week: Number,

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    level: {
      type: String,
      required: true,
    },

    suggestedCourse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    reason: {
      type: String,
      default: "No lecturer available",
    },

    status: {
      type: String,
      enum: ["PENDING", "ASSIGNED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "PendingAssignment",
  pendingAssignmentSchema
);