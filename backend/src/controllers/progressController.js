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

    const progress =
      await Progress.find()
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

      completedDate: new Date(),

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

export const removeCompletedCourse = async (req, res) => {
  try {
    const progress = await Progress.findById(
      req.params.id
    );

    if (!progress) {
      return res.status(404).json({
        message: "Progress not found",
      });
    }

    const courseId = req.body.courseId;

    progress.completedCourses =
      progress.completedCourses.filter(
        (item) =>
          item.course.toString() !== courseId
      );

    await progress.save();

    res.json(progress);

  } catch (error) {
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

    const summary =
      await calculateBranchProgress(
        req.params.branchId
      );

    res.json(summary);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};