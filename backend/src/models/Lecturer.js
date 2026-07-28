import mongoose from "mongoose";

const lecturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],

    preferredRegions: [
      {
        type: String,
        trim: true
      }
    ],

    secondaryRegions: [
      {
        type: String,
        trim: true
      }
    ],

    // Teaching weeks lecturer is available
    availability: {
      type: [Number],
      default: [1, 2, 3, 4]
    },

    active: {
      type: Boolean,
      default: true
    },

    maxAssignmentsPerMonth: {
      type: Number,
      default: 4
    },

    // Reset to 0 whenever a new month's schedule is generated
    currentAssignments: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Lecturer", lecturerSchema);