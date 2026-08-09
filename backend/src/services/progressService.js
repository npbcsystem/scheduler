import Progress from "../models/Progress.js";
import Course from "../models/Course.js";

export const calculateBranchProgress = async (branchId) => {

  const levels = [
    "CERTIFICATE",
    "ASSOCIATE",
    "DIPLOMA",
  ];

  const result = {
    levels: {},
    overall: {},
  };

  let overallCompleted = 0;
  let overallTotal = 0;

  for (const level of levels) {

    const progress = await Progress.findOne({
      branch: branchId,
      level,
    });

    const totalCourses = await Course.countDocuments({
      level,
    });

    const completed = progress
      ? progress.completedCourses.length
      : 0;

    const percentage =
      totalCourses === 0
        ? 0
        : Math.round(
            (completed / totalCourses) * 100
          );

    result.levels[level] = {

      completed,

      total: totalCourses,

      percentage,

    };

    overallCompleted += completed;

    overallTotal += totalCourses;
  }

  result.overall = {

    completed: overallCompleted,

    total: overallTotal,

    percentage:
      overallTotal === 0
        ? 0
        : Math.round(
            (overallCompleted / overallTotal) *
              100
          ),

  };

  return result;
};