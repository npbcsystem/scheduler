import Lecturer from "../models/Lecturer.js";

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