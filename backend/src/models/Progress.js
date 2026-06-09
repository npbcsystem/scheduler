import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch"
    },

    level: {
      type: String,
      enum: [
        "CERTIFICATE",
        "ASSOCIATE",
        "DIPLOMA"
      ]
    },

    completedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model(
  "Progress",
  progressSchema
);