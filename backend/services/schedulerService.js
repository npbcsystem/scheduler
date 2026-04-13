import Branch from "../models/branch.js";
import Course from "../models/Course.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

export const generateSchedule = async (monthDates) => {
  const lecturers = await Lecturer.find();
  const courses = await Course.find();

  for (let week = 1; week <= 4; week++) {

    const branches = await Branch.find({ weekAssigned: week });

    let usedLecturers = new Set();

    let classes = [];

    // Expand classes
    for (let branch of branches) {
      for (let level of branch.levels) {
        classes.push({ branch, level });
      }
    }

    for (let cls of classes) {

      const progress = await Progress.findOne({
        branchId: cls.branch._id,
        level: cls.level
      });

      const levelCourses = courses.filter(c => c.level === cls.level);

      const completed = progress?.coursesCompleted || [];

      const remaining = levelCourses.filter(
        c => !completed.includes(c.name)
      );

      if (remaining.length === 0) continue;

      const course = remaining[Math.floor(Math.random() * remaining.length)];

      const eligibleLecturers = lecturers.filter(l =>
        l.courses.includes(course.name) &&
        l.preferredLocations.includes(cls.branch.location) &&
        !usedLecturers.has(l._id.toString())
      );

      if (eligibleLecturers.length === 0) continue;

      const lecturer = eligibleLecturers[0];

      usedLecturers.add(lecturer._id.toString());

      await Schedule.create({
        date: monthDates[week - 1],
        week,
        branchId: cls.branch._id,
        level: cls.level,
        course: course.name,
        lecturerId: lecturer._id
      });

      await Progress.updateOne(
        { branchId: cls.branch._id, level: cls.level },
        { $addToSet: { coursesCompleted: course.name } },
        { upsert: true }
      );
    }
  }
};