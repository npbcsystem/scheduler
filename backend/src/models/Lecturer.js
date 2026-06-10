import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    phone: String,

    email: String,

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],

    preferredRegions: [String],

    secondaryRegions: [String],

    active: {
      type: Boolean,
      default: true
    },

    maxAssignmentsPerMonth: {
      type: Number,
      default: 4
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model(
  "Lecturer",
  lecturerSchema
);