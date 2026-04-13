import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: String,
  location: String,
  weekAssigned: Number,
  levels: [String] // ["Certificate", "Diploma"]
});

export default mongoose.model("Branch", branchSchema);