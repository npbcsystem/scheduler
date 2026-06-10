import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },

    level: {
      type: String,
      enum: [
        "CERTIFICATE",
        "ASSOCIATE",
        "DIPLOMA"
      ],
      required: true
    },

    completedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Progress",
  progressSchema
);