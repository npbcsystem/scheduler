import Lecturer from "../models/Lecturer.js";
import Schedule from "../models/Schedule.js";

export const createLecturer = async (
  req,
  res
) => {
  try {
    const lecturer =
      await Lecturer.create(req.body);

    res.status(201).json(lecturer);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getLecturers = async (
  req,
  res
) => {
  try {
    const lecturers =
      await Lecturer.find()
        .populate("courses");

    res.json(lecturers);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getLecturer = async (
  req,
  res
) => {
  try {
    const lecturer =
      await Lecturer.findById(
        req.params.id
      ).populate("courses");

    res.json(lecturer);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const updateLecturer = async (
  req,
  res
) => {
  try {
    const lecturer =
      await Lecturer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(lecturer);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const deleteLecturer = async (
  req,
  res
) => {
  try {
    await Lecturer.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Lecturer deleted"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// get lecturers by course

export const getLecturersByCourse = async (req, res) => {
  try {
    const lecturers = await Lecturer.find({
      active: true,
      courses: req.params.courseId,
    }).sort({
      currentAssignments: 1,
      name: 1,
    });

    res.json(lecturers);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


export const getLecturersByCourseAvailability =
  async (req, res) => {
    try {
      const {
        courseId,
      } = req.params;

      const {
        week,
        month,
        year,
        excludeScheduleId,
      } = req.query;

      const lecturers =
        await Lecturer.find({
          courses: courseId,
          active: true,
        });

      const schedulesQuery = {
        week: Number(week),
        month: Number(month),
        year: Number(year),
        status: {
          $in: [
            "DRAFT",
            "APPROVED",
            "CANCELLED",
          ],
        },
      };

      // Don't count the schedule we are currently editing
      if (excludeScheduleId) {
        schedulesQuery._id = {
          $ne: excludeScheduleId,
        };
      }

      const schedules =
        await Schedule.find(
          schedulesQuery
        );

      const assignedLecturerIds =
        new Set(
          schedules
            .filter(
              (schedule) =>
                schedule.lecturer
            )
            .map(
              (schedule) =>
                schedule.lecturer.toString()
            )
        );

      const result =
        lecturers.map(
          (lecturer) => ({
            ...lecturer.toObject(),

            assignedThisWeek:
              assignedLecturerIds.has(
                lecturer._id.toString()
              ),
          })
        );

      res.json(result);
    } catch (error) {
      console.error(
        "LECTURER AVAILABILITY ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };