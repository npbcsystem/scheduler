const lecturerSchema = new mongoose.Schema({
  name: String,
  courses: [String],
  preferredLocations: [String],
  availableDays: [String]
});

export default mongoose.model("Lecturer", lecturerSchema);