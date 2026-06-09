import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    year: Number,

    month: Number,

    week: Number,

    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },

    level: String,

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },

    lecturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecturer"
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "COMPLETED",
        "CANCELLED"
      ],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "Schedule",
  scheduleSchema
);