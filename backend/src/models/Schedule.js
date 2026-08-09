import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    year: Number,

    month: Number,

    week: Number,

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },

    level: String,

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer",
    },

    status: {
      type: String,
      enum: ["DRAFT", "APPROVED", "COMPLETED", "CANCELLED"],
      default: "DRAFT",
    },
    source: {
      type: String,
      enum: ["AUTO", "MANUAL"],
      default: "AUTO",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Schedule", scheduleSchema);
