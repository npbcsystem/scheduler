import mongoose from "mongoose";

export const centerTypes = ["NPBC", "PEFA", "WW", "DC"];

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    region: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: centerTypes,
      default: null,
    },

    week: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    coordinatorName: {
      type: String,
      trim: true,
    },

    coordinatorPhone: {
      type: String,
      trim: true,
    },

    levels: [
      {
        type: String,
        enum: ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"],
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Branch", branchSchema);
