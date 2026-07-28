import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

export const generateSchedule = async (week) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

  const schedules = [];

  // Prevent assigning the same lecturer twice in one scheduling run
  const usedLecturers = new Set();

  // Reset workload for this scheduling run
  await Lecturer.updateMany({}, { currentAssignments: 0 });

  const branches = await Branch.find({
    week,
    active: true,
  });

  console.log(`Found ${branches.length} branches for Week ${week}`);

  for (const branch of branches) {
    console.log(`\n========== ${branch.name} ==========`);

    for (const level of branch.levels) {
      console.log(`Processing ${level}`);

      // --------------------------------------------------
      // Get or Create Progress
      // --------------------------------------------------

      let progress = await Progress.findOne({
        branch: branch._id,
        level,
      });

      if (!progress) {
        progress = await Progress.create({
          branch: branch._id,
          level,
          completedCourses: [],
        });

        console.log("Progress created.");
      }

      // --------------------------------------------------
      // Get Remaining Courses
      // --------------------------------------------------

      const completed = progress.completedCourses || [];

      const levelCourses = await Course.find({
        level,
      }).sort({
        code: 1,
      });

      const remainingCourses = levelCourses.filter(
        (course) =>
          !completed.some(
            (completedId) =>
              completedId.toString() === course._id.toString()
          )
      );

      if (remainingCourses.length === 0) {
        console.log(`All ${level} courses completed.`);

        continue;
      }

      const selectedCourse = remainingCourses[0];

      console.log(
        `Selected Course: ${selectedCourse.code} - ${selectedCourse.name}`
      );

      // --------------------------------------------------
      // Prevent duplicate schedule
      // --------------------------------------------------

      const existing = await Schedule.findOne({
        branch: branch._id,
        level,
        week,
        month,
        year,
      });

      if (existing) {
        console.log("Schedule already exists.");

        continue;
      }

      // --------------------------------------------------
      // Find lecturers (Preferred Region)
      // --------------------------------------------------

      let lecturers = await Lecturer.find({
        active: true,
        courses: selectedCourse._id,
        preferredRegions: branch.region,
      });

      // --------------------------------------------------
      // Fallback to Secondary Region
      // --------------------------------------------------

      if (lecturers.length === 0) {
        lecturers = await Lecturer.find({
          active: true,
          courses: selectedCourse._id,
          secondaryRegions: branch.region,
        });
      }

      // --------------------------------------------------
      // Filter by Availability
      // --------------------------------------------------

      lecturers = lecturers.filter((lecturer) =>
        lecturer.availability.includes(week)
      );

      // --------------------------------------------------
      // Remove already assigned lecturers
      // --------------------------------------------------

      lecturers = lecturers.filter(
        (lecturer) => !usedLecturers.has(lecturer._id.toString())
      );

      console.log(
        "Matching Lecturers:",
        lecturers.map((l) => l.name)
      );

      if (lecturers.length === 0) {
        console.log(
          `No lecturer available for ${branch.name} (${level})`
        );

        continue;
      }

      // --------------------------------------------------
      // Balance workload
      // --------------------------------------------------

      lecturers.sort(
        (a, b) =>
          a.currentAssignments - b.currentAssignments
      );

      const lecturer = lecturers[0];

      // --------------------------------------------------
      // Update workload
      // --------------------------------------------------

      lecturer.currentAssignments++;

      await lecturer.save();

      usedLecturers.add(lecturer._id.toString());

      // --------------------------------------------------
      // Save Schedule
      // --------------------------------------------------

      const schedule = await Schedule.create({
        year,
        month,
        week,

        branch: branch._id,

        level,

        course: selectedCourse._id,

        lecturer: lecturer._id,

        status: "PENDING",
      });

      console.log(
        `Assigned ${lecturer.name} -> ${selectedCourse.code}`
      );

      schedules.push(schedule);
    }
  }

  console.log(
    `\nSchedule generation complete. ${schedules.length} schedules created.`
  );

  return schedules;
};