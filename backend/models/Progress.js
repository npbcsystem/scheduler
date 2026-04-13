const progressSchema = new mongoose.Schema({
  branchId: mongoose.Schema.Types.ObjectId,
  level: String,
  coursesCompleted: [String]
});

export default mongoose.model("Progress", progressSchema);