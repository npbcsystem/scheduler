import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },
    ],

    preferredRegions: [
      {
        type: String,
      },
    ],

    secondaryRegions: [
      {
        type: String,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },

    maxAssignmentsPerMonth: {
      type: Number,
      default: 4,
      min: 1,
    },

    currentAssignments: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lecturer", lecturerSchema);