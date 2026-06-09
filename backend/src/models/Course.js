import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    code: {
      type: String,
      unique: true
    },

    level: {
      type: String,
      enum: [
        "CERTIFICATE",
        "ASSOCIATE",
        "DIPLOMA"
      ]
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "Course",
  courseSchema
);