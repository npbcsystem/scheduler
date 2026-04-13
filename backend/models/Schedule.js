const scheduleSchema = new mongoose.Schema({
  date: Date,
  week: Number,
  branchId: mongoose.Schema.Types.ObjectId,
  level: String,
  course: String,
  lecturerId: mongoose.Schema.Types.ObjectId
});

export default mongoose.model("Schedule", scheduleSchema);