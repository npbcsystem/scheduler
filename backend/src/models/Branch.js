import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },

    region: {
      type: String,
      required: true
    },

    week: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    levels: [
      {
        type: String,
        enum: [
          "CERTIFICATE",
          "ASSOCIATE",
          "DIPLOMA"
        ]
      }
    ],

    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "Branch",
  branchSchema
);