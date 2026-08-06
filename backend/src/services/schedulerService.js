import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

/**
 * ----------------------------------------------------
 * Find the best available lecturer
 * ----------------------------------------------------
 */
const findAvailableLecturers = async (courseId, region, usedLecturers) => {
  const searches = [
    {
      title: "Preferred Region",
      filter: {
        active: true,
        courses: courseId,
        preferredRegions: region,
      },
    },
    {
      title: "Secondary Region",
      filter: {
        active: true,
        courses: courseId,
        secondaryRegions: region,
      },
    },
    {
      title: "Any Region",
      filter: {
        active: true,
        courses: courseId,
      },
    },
  ];

  for (const search of searches) {
    let lecturers = await Lecturer.find(search.filter);

    console.log(`\n${search.title}`);
    console.log(
      "Found:",
      lecturers.map((l) => l.name),
    );

    lecturers = lecturers.filter((l) => !usedLecturers.has(l._id.toString()));

    console.log(
      "After Used Filter:",
      lecturers.map((l) => l.name),
    );

    lecturers = lecturers.filter(
      (l) => l.currentAssignments < l.maxAssignmentsPerMonth,
    );

    console.log(
      "After Workload Filter:",
      lecturers.map((l) => l.name),
    );

    lecturers.sort((a, b) => a.currentAssignments - b.currentAssignments);

    if (lecturers.length > 0) {
      return lecturers;
    }
  }

  return [];
};

/**
 * ----------------------------------------------------
 * Generate Schedule
 * ----------------------------------------------------
 */
export const generateSchedule = async (week) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  // Reset workload
  await Lecturer.updateMany({}, { currentAssignments: 0 });

  const usedLecturers = new Set();

  const branches = await Branch.find({ week });

  console.log(`Found ${branches.length} branches for Week ${week}`);

  let schedulesCreated = 0;

  for (const branch of branches) {
    console.log(`\n========== ${branch.name} ==========`);

    for (const level of branch.levels) {
      console.log(`Processing ${level}`);

      //------------------------------------------------
      // Existing Schedule?
      //------------------------------------------------

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

      //------------------------------------------------
      // Progress
      //------------------------------------------------

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

      //------------------------------------------------
      // Remaining Course
      //------------------------------------------------

      const remainingCourses = await Course.find({
        level,
        _id: {
          $nin: progress.completedCourses,
        },
      }).sort({ code: 1 });

      if (!remainingCourses.length) {
        console.log(`All ${level} courses completed.`);
        continue;
      }

      const selectedCourse = remainingCourses[0];

      console.log(
        `Selected Course: ${selectedCourse.code} - ${selectedCourse.name}`,
      );

      console.log("\n==============================");
      console.log("Branch:", branch.name);
      console.log("Region:", branch.region);
      console.log("Course:", selectedCourse.code);
      console.log("==============================");

      //------------------------------------------------
      // Lecturer Selection
      //------------------------------------------------

      const lecturers = await findAvailableLecturers(
        selectedCourse._id,
        branch.region,
        usedLecturers,
      );

      console.log(
        "Matching Lecturers:",
        lecturers.map((l) => l.name),
      );

      if (!lecturers.length) {
        console.log(`No lecturer available for ${branch.name} (${level})`);
        continue;
      }

      const lecturer = lecturers[0];

      //------------------------------------------------
      // Update Workload
      //------------------------------------------------

      lecturer.currentAssignments++;

      await lecturer.save();

      usedLecturers.add(lecturer._id.toString());

      //------------------------------------------------
      // Save Schedule
      //------------------------------------------------

      await Schedule.create({
        year,
        month,
        week,
        branch: branch._id,
        level,
        course: selectedCourse._id,
        lecturer: lecturer._id,
        status: "PENDING",
      });

      console.log(`Assigned ${lecturer.name} -> ${selectedCourse.code}`);

      schedulesCreated++;
    }
  }

  console.log(
    `\nSchedule generation complete. ${schedulesCreated} schedules created.`,
  );

  return {
    success: true,

    week,

    month,

    year,

    schedulesCreated,

    message: `${schedulesCreated} schedules generated successfully.`,
  };
};
