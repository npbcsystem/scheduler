const courseSchema = new mongoose.Schema({
  name: String,
  level: String
});

export default mongoose.model("Course", courseSchema);