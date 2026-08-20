import Course from "../models/Course.js";
import Progress from "../models/Progress.js";
import Schedule from "../models/Schedule.js";

const allowedLevels = [
  "CERTIFICATE",
  "ASSOCIATE",
  "DIPLOMA",
];

// --------------------------------------------------
// Create Course
// --------------------------------------------------

export const createCourse = async (req, res) => {
  try {
    const { code, name, level } = req.body;

    if (!code || !name || !level) {
      return res.status(400).json({
        message:
          "Course code, name and level are required.",
      });
    }

    if (!allowedLevels.includes(level)) {
      return res.status(400).json({
        message: "Invalid course level.",
      });
    }

    const existingCourse =
      await Course.findOne({
        code: code.trim().toUpperCase(),
      });

    if (existingCourse) {
      return res.status(409).json({
        message:
          "A course with this code already exists.",
      });
    }

    const course = await Course.create({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      level,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(
      "CREATE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// --------------------------------------------------
// Get Courses
// --------------------------------------------------

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({
      level: 1,
      code: 1,
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// --------------------------------------------------
// Get Single Course
// --------------------------------------------------

export const getCourse = async (req, res) => {
  try {
    const course =
      await Course.findById(
        req.params.id
      );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// --------------------------------------------------
// Update Course
// --------------------------------------------------

export const updateCourse = async (
  req,
  res
) => {
  try {
    const course =
      await Course.findById(
        req.params.id
      );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const {
      code,
      name,
      level,
    } = req.body;

    // ----------------------------------------------
    // Validate level
    // ----------------------------------------------

    if (
      level !== undefined &&
      !allowedLevels.includes(level)
    ) {
      return res.status(400).json({
        message:
          "Invalid course level.",
      });
    }

    // ----------------------------------------------
    // Check whether course has been used
    // ----------------------------------------------

    const scheduleCount =
      await Schedule.countDocuments({
        course: course._id,
      });

    const progressCount =
      await Progress.countDocuments({
        "completedCourses.course":
          course._id,
      });

    const hasAcademicRecords =
      scheduleCount > 0 ||
      progressCount > 0;

    // ----------------------------------------------
    // Prevent moving used course to another level
    // ----------------------------------------------

    if (
      level !== undefined &&
      level !== course.level &&
      hasAcademicRecords
    ) {
      return res.status(409).json({
        message:
          `Cannot change the level of ${course.code}. ` +
          `This course already has academic records.`,
        scheduleCount,
        progressCount,
      });
    }

    // ----------------------------------------------
    // Check duplicate code
    // ----------------------------------------------

    if (code !== undefined) {
      const cleanCode =
        code.trim().toUpperCase();

      const duplicate =
        await Course.findOne({
          code: cleanCode,
          _id: {
            $ne: course._id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          message:
            "Another course already uses this code.",
        });
      }

      course.code = cleanCode;
    }

    // ----------------------------------------------
    // Update name
    // ----------------------------------------------

    if (name !== undefined) {
      course.name = name.trim();
    }

    // ----------------------------------------------
    // Update level
    // ----------------------------------------------

    if (level !== undefined) {
      course.level = level;
    }

    await course.save();

    res.json(course);
  } catch (error) {
    console.error(
      "UPDATE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

// --------------------------------------------------
// Delete Course
// --------------------------------------------------

export const deleteCourse = async (
  req,
  res
) => {
  try {
    const course =
      await Course.findById(
        req.params.id
      );

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    // ----------------------------------------------
    // Check schedules
    // ----------------------------------------------

    const scheduleCount =
      await Schedule.countDocuments({
        course: course._id,
      });

    // ----------------------------------------------
    // Check progress
    // ----------------------------------------------

    const progressCount =
      await Progress.countDocuments({
        "completedCourses.course":
          course._id,
      });

    // ----------------------------------------------
    // Prevent deletion
    // ----------------------------------------------

    if (
      scheduleCount > 0 ||
      progressCount > 0
    ) {
      return res.status(409).json({
        message:
          `Cannot delete ${course.code} - ${course.name}. ` +
          `This course is already associated with academic records.`,
        scheduleCount,
        progressCount,
      });
    }

    await Course.findByIdAndDelete(
      course._id
    );

    res.json({
      message: "Course deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE COURSE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};