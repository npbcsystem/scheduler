import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    level: {
      type: String,
      enum: ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"],
      required: true,
    },

    completedCourses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },

        completedDate: {
          type: Date,
          default: Date.now,
        },

        lecturer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lecturer",
        },

        schedule: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule",
        },

        manuallyCompleted: {
          type: Boolean,
          default: false,
        },

        notes: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Progress", progressSchema);
