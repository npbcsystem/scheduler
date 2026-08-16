import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Branch from "../models/Branch.js";
import { calculateBranchProgress } from "../services/progressService.js";

export const createProgress = async (req, res) => {
  try {
    const progress = await Progress.create(req.body);

    res.status(201).json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find()
      .populate("branch")
      .populate("completedCourses.course")
      .populate("completedCourses.lecturer")
      .populate("completedCourses.schedule");

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addCompletedCourse = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const alreadyCompleted = progress.completedCourses.some(
      (item) => item.course.toString() === req.body.courseId,
    );

    if (alreadyCompleted) {
      return res.status(400).json({
        message: "Course already completed.",
      });
    }

    progress.completedCourses.push({
      course: req.body.courseId,

      completedDate: req.body.completedDate
        ? new Date(req.body.completedDate)
        : new Date(),

      lecturer: req.body.lecturer || null,

      schedule: req.body.schedule || null,

      manuallyCompleted: req.body.manuallyCompleted ?? true,

      notes: req.body.notes || "",
    });

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addCompletedCourses = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const {
      courseIds,
      completedDate,
      lecturer,
      schedule,
      manuallyCompleted,
      notes,
    } = req.body;

    if (!Array.isArray(courseIds) || courseIds.length === 0) {
      return res.status(400).json({
        message: "Please select at least one course.",
      });
    }

    // ---------------------------------------------
    // Existing completed course IDs
    // ---------------------------------------------

    const existingIds =
      progress.completedCourses.map(
        (item) => item.course.toString()
      );

    // ---------------------------------------------
    // Remove duplicates from submitted courses
    // ---------------------------------------------

    const uniqueCourseIds = [
      ...new Set(courseIds),
    ];

    // ---------------------------------------------
    // Only add courses that aren't already completed
    // ---------------------------------------------

    const newCourseIds =
      uniqueCourseIds.filter(
        (courseId) =>
          !existingIds.includes(courseId)
      );

    if (newCourseIds.length === 0) {
      return res.status(400).json({
        message:
          "All selected courses are already completed.",
      });
    }

    // ---------------------------------------------
    // Add selected courses
    // ---------------------------------------------

    for (const courseId of newCourseIds) {
      progress.completedCourses.push({
        course: courseId,

        completedDate: completedDate
          ? new Date(completedDate)
          : new Date(),

        lecturer: lecturer || null,

        schedule: schedule || null,

        manuallyCompleted:
          manuallyCompleted ?? true,

        notes: notes || "",
      });
    }

    await progress.save();

    // Return populated result
    const updatedProgress =
      await Progress.findById(progress._id)
        .populate("branch")
        .populate("completedCourses.course")
        .populate("completedCourses.lecturer")
        .populate("completedCourses.schedule");

    res.json(updatedProgress);

  } catch (error) {
    console.error(
      "ADD COMPLETED COURSES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeCompletedCourse = async (req, res) => {
  try {
    const progress = await Progress.findById(req.params.id);

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const courseId = req.body.courseId;

    progress.completedCourses = progress.completedCourses.filter(
      (item) => item.course.toString() !== courseId,
    );

    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeCompletedCourses = async (
  req,
  res
) => {
  try {
    const progress = await Progress.findById(
      req.params.id
    );

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const { courseIds } = req.body;

    if (
      !Array.isArray(courseIds) ||
      courseIds.length === 0
    ) {
      return res.status(400).json({
        message:
          "Please select at least one course.",
      });
    }

    const idsToRemove =
      new Set(courseIds);

    progress.completedCourses =
      progress.completedCourses.filter(
        (item) =>
          !idsToRemove.has(
            item.course.toString()
          )
      );

    await progress.save();

    const updatedProgress =
      await Progress.findById(progress._id)
        .populate("branch")
        .populate("completedCourses.course")
        .populate("completedCourses.lecturer")
        .populate("completedCourses.schedule");

    res.json(updatedProgress);

  } catch (error) {
    console.error(
      "REMOVE COMPLETED COURSES ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

export const getRemainingCourses = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      branch: req.params.branchId,
      level: req.params.level,
    });

    const completedCourses = progress
      ? progress.completedCourses.map((item) => item.course)
      : [];

    const remaining = await Course.find({
      level: req.params.level,
      _id: {
        $nin: completedCourses,
      },
    }).sort({ code: 1 });

    res.json(remaining);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getBranchProgress = async (req, res) => {
  try {
    const summary = await calculateBranchProgress(req.params.branchId);

    res.json(summary);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
