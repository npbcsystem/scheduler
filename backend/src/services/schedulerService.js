import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

export const generateSchedule = async (week) => {
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const schedule = [];

  const usedLecturers = new Set();

  const branches = await Branch.find({
    week,
    active: true,
  });

  console.log("Branches found:", branches.length);

  for (const branch of branches) {
    for (const level of branch.levels) {
      //   const progress = await Progress.findOne({
      //     branch: branch._id,
      //     level,
      //   });

      //   console.log("Progress:", progress);
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
      }

      const completed = progress?.completedCourses || [];

      const levelCourses = await Course.find({
        level,
      });

      const remaining = levelCourses.filter(
        (course) =>
          !completed.some((c) => c.toString() === course._id.toString()),
      );

      if (remaining.length === 0) {
        continue;
      }

      const selectedCourse = remaining[0];

      //   console
      console.log(
        "Matching lecturers:",
        lecturers.map((l) => l.name),
      );

      let lecturers = await Lecturer.find({
        active: true,
        courses: selectedCourse._id,
        preferredRegions: branch.region,
      });

      if (lecturers.length === 0) {
        lecturers = await Lecturer.find({
          active: true,
          courses: selectedCourse._id,
          secondaryRegions: branch.region,
        });
      }

      lecturers = lecturers.filter((l) => !usedLecturers.has(l._id.toString()));

      if (lecturers.length === 0) {
        console.log(`No lecturer found for ${branch.name}`);

        continue;
      }

      const lecturer = lecturers[0];

      usedLecturers.add(lecturer._id.toString());

      const existing = await Schedule.findOne({
        branch: branch._id,
        level,
        week,
        month,
        year,
      });

      if (existing) {
        continue;
      }

    //   console
    console.log("Saving schedule...");

      const savedSchedule = await Schedule.create({
        branch: branch._id,
        level,
        course: selectedCourse._id,
        lecturer: lecturer._id,
        week,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

    //   console
    console.log(
  "Saved:",
  savedSchedule._id
);

      schedule.push(savedSchedule);
    }
  }

  return schedule;
};
