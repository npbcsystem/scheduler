import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

export const calculateBranchProgress = async (branchId) => {
  const levels = ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"];

  const result = {
    levels: {},
    overall: {},
  };

  let overallCompleted = 0;
  let overallTotal = 0;

  for (const level of levels) {
    // ---------------------------------------------
    // Get all courses for this level
    // ---------------------------------------------

    const courses = await Course.find({
      level,
    }).sort({
      code: 1,
    });

    // ---------------------------------------------
    // Get branch progress for this level
    // ---------------------------------------------

    let progress = await Progress.findOne({
      branch: branchId,
      level,
    }).populate("completedCourses.course");

    if (!progress) {
      progress = await Progress.create({
        branch: branchId,
        level,
        completedCourses: [],
      });
    }

    const completedCourses = progress?.completedCourses || [];

    // ---------------------------------------------
    // Completed course IDs
    // ---------------------------------------------

    const completedIds = completedCourses.map((item) =>
      item.course?._id?.toString(),
    );

    // ---------------------------------------------
    // Calculate counts
    // ---------------------------------------------

    const totalCourses = courses.length;

    const completed = completedCourses.length;

    const remaining = Math.max(totalCourses - completed, 0);

    const percentage =
      totalCourses === 0 ? 0 : Math.round((completed / totalCourses) * 100);

    // ---------------------------------------------
    // Remaining courses
    // ---------------------------------------------

    const remainingCourses = courses.filter(
      (course) => !completedIds.includes(course._id.toString()),
    );

    // ---------------------------------------------
    // Save level result
    // ---------------------------------------------

    result.levels[level] = {
      progressId: progress?._id || null,

      completed,

      total: totalCourses,

      remaining,

      percentage,

      completedCourses,

      remainingCourses,
    };
    // ---------------------------------------------
    // Overall calculation
    // ---------------------------------------------

    overallCompleted += completed;

    overallTotal += totalCourses;
  }

  // ---------------------------------------------
  // Overall progress
  // ---------------------------------------------

  result.overall = {
    completed: overallCompleted,

    total: overallTotal,

    remaining: overallTotal - overallCompleted,

    percentage:
      overallTotal === 0
        ? 0
        : Math.round((overallCompleted / overallTotal) * 100),
  };

  return result;
};
