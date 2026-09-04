import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";
import PendingAssignment from "../models/PendingAssignment.js";

/**
 * ---------------------------------------------------------
 * Find available lecturers for a course
 *
 * Priority:
 *
 * 1. Preferred Region
 * 2. Secondary Region
 * 3. Any Region
 *
 * Also:
 * - active lecturers only
 * - lecturer cannot already be used in this generation
 * - monthly workload must not be exceeded
 * - lowest workload is preferred
 * ---------------------------------------------------------
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
        $or: [
          {
            secondaryRegions: region,
          },
          {
            secondaryRegions: "ALL",
          },
        ],
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

    // ----------------------------------------------------
    // Remove lecturers already used during this generation
    // ----------------------------------------------------

    lecturers = lecturers.filter(
      (lecturer) => !usedLecturers.has(lecturer._id.toString()),
    );

    console.log(
      "After Used Filter:",
      lecturers.map((l) => l.name),
    );

    // ----------------------------------------------------
    // Respect monthly workload
    // ----------------------------------------------------

    lecturers = lecturers.filter(
      (lecturer) =>
        lecturer.currentAssignments < lecturer.maxAssignmentsPerMonth,
    );

    console.log(
      "After Workload Filter:",
      lecturers.map((l) => l.name),
    );

    // ----------------------------------------------------
    // Lowest workload first
    // ----------------------------------------------------

    lecturers.sort((a, b) => a.currentAssignments - b.currentAssignments);

    if (lecturers.length > 0) {
      return lecturers;
    }
  }

  return [];
};

/**
 * ---------------------------------------------------------
 * Generate Schedule
 * ---------------------------------------------------------
 */

export const generateSchedule = async (week, month, year) => {
  month = Number(month) || new Date().getMonth() + 1;

  year = Number(year) || new Date().getFullYear();

  const unassigned = [];

  let expectedClasses = 0;

  let schedulesCreated = 0;

  // -------------------------------------------------------
  // Remove old pending assignments for this period
  // -------------------------------------------------------

  await PendingAssignment.deleteMany({
    week,
    month,
    year,
  });

  // -------------------------------------------------------
  // Reset lecturer workload for this generation
  // -------------------------------------------------------

  await Lecturer.updateMany(
    {},
    {
      currentAssignments: 0,
    },
  );

  const usedLecturers = new Set();

  // -------------------------------------------------------
  // Find branches scheduled for this week
  // -------------------------------------------------------

  const branches = await Branch.find({
    week,
  });

  // console.log(`Found ${branches.length} branches for Week ${week}`);

  // =======================================================
  // PROCESS BRANCHES
  // =======================================================

  for (const branch of branches) {
    // console.log(`\n========== ${branch.name} ==========`);

    // =====================================================
    // PROCESS LEVELS
    // =====================================================

    for (const level of branch.levels) {
      // console.log(`Processing ${level}`);

      // ---------------------------------------------------
      // Check whether schedule already exists
      // ---------------------------------------------------

      const existing = await Schedule.findOne({
        branch: branch._id,
        level,
        week,
        month,
        year,
      });

      if (existing) {
        console.log(`Schedule already exists for ${branch.name} ${level}`);

        continue;
      }

      // ---------------------------------------------------
      // Find progress
      // ---------------------------------------------------

      let progress = await Progress.findOne({
        branch: branch._id,
        level,
      });

      // ---------------------------------------------------
      // Create progress if it doesn't exist
      // ---------------------------------------------------

      if (!progress) {
        progress = await Progress.create({
          branch: branch._id,
          level,
          completedCourses: [],
        });

        console.log("Progress created.");
      }

      // ---------------------------------------------------
      // Get completed course IDs
      // ---------------------------------------------------

      const completedCourseIds = progress.completedCourses.map(
        (item) => item.course,
      );

      // ---------------------------------------------------
      // Find remaining courses
      // ---------------------------------------------------

      const remainingCourses = await Course.find({
        level,

        _id: {
          $nin: completedCourseIds,
        },
      }).sort({
        code: 1,
      });

      // ---------------------------------------------------
      // No courses remaining
      // ---------------------------------------------------

      if (!remainingCourses.length) {
        // console.log(`All ${level} courses completed.`);

        continue;
      }

      expectedClasses++;


      // ===================================================
      // SMART COURSE SELECTION
      // ===================================================

      let selectedCourse = null;

      let selectedLecturer = null;


      // ---------------------------------------------------
      // Try every remaining course
      // until we find one with a lecturer
      // ---------------------------------------------------

      for (const course of remainingCourses) {
        // console.log(`\nTrying course: ${course.code} - ${course.name}`);

        const lecturers = await findAvailableLecturers(
          course._id,
          branch.region,
          usedLecturers,
        );

       

        if (lecturers.length > 0) {
          selectedCourse = course;

          selectedLecturer = lecturers[0];

          console.log(`SELECTED: ${course.code} -> ${selectedLecturer.name}`);

          break;
        }

        // console.log(`No available lecturer for ${course.code}`);
      }

      // ===================================================
      // NO COURSE + LECTURER FOUND
      // ===================================================

      if (!selectedCourse || !selectedLecturer) {
        
        const suggestedCourse = remainingCourses[0];

        // -------------------------------------------------
        // Create pending assignment
        // -------------------------------------------------

        await PendingAssignment.create({
          year,

          month,

          week,

          branch: branch._id,

          level,

          suggestedCourse: suggestedCourse._id,

          reason: "No lecturer available for any remaining course",
        });

        // -------------------------------------------------
        // Add to response
        // -------------------------------------------------

        unassigned.push({
          branch: branch._id,

          branchName: branch.name,

          region: branch.region,

          level,

          course: suggestedCourse._id,

          courseCode: suggestedCourse.code,

          courseName: suggestedCourse.name,

          reason: "No lecturer available for any remaining course",
        });

        continue;
      }

      // ---------------------------------------------------
      // Update lecturer workload
      // ---------------------------------------------------

      selectedLecturer.currentAssignments++;

      await selectedLecturer.save();

      // ---------------------------------------------------
      // Prevent lecturer from being used again
      // during this generation
      // ---------------------------------------------------

      usedLecturers.add(selectedLecturer._id.toString());

      // ---------------------------------------------------
      // Create schedule
      // ---------------------------------------------------

      await Schedule.create({
        year,

        month,

        week,

        branch: branch._id,

        level,

        course: selectedCourse._id,

        lecturer: selectedLecturer._id,

        status: "DRAFT",
      });


      schedulesCreated++;
    }
  }

  // =======================================================
  // SUMMARY
  // =======================================================


  // =======================================================
  // RETURN
  // =======================================================

  return {
    success: true,

    week,

    month,

    year,

    expectedClasses,

    schedulesCreated,

    unassignedCount: unassigned.length,

    unassigned,
  };
};
