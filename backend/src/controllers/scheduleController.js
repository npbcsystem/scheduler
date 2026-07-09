import { generateSchedule } from "../services/schedulerService.js";
import Schedule from "../models/Schedule.js";
import Lecturer from "../models/Lecturer.js";
import Progress from "../models/Progress.js";

export const generate = async (req, res) => {
  try {
    const week = Number(req.params.week);

    const result = await generateSchedule(week);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate("branch")
      .populate("course")
      .populate("lecturer");

    res.json(schedules);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// update lecturer's current assignments
export const updateSchedule = async (req, res) => {
  try {
    const { course, lecturer, status } = req.body;

    const schedule = await Schedule.findById(req.params.id);

    const previousStatus = schedule.status;

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found",
      });
    }

    //----------------------------------------------------
    // Course changed?
    //----------------------------------------------------

    if (course && course !== schedule.course.toString()) {
      schedule.course = course;
    }

    //----------------------------------------------------
    // Lecturer changed?
    //----------------------------------------------------

    if (lecturer && lecturer !== schedule.lecturer.toString()) {
      //--------------------------------------------------
      // Old lecturer
      //--------------------------------------------------

      const oldLecturer = await Lecturer.findById(schedule.lecturer);

      if (oldLecturer) {
        oldLecturer.currentAssignments = Math.max(
          0,
          oldLecturer.currentAssignments - 1,
        );

        await oldLecturer.save();
      }

      //--------------------------------------------------
      // New lecturer
      //--------------------------------------------------

      const newLecturer = await Lecturer.findById(lecturer);

      if (newLecturer) {
        newLecturer.currentAssignments++;

        await newLecturer.save();
      }

      schedule.lecturer = lecturer;
    }

    //----------------------------------------------------
    // Status
    //----------------------------------------------------

    if (status) {

  schedule.status = status;

  //--------------------------------------------------
  // Progress Record
  //--------------------------------------------------

  let progress = await Progress.findOne({
    branch: schedule.branch,
    level: schedule.level,
  });

  if (!progress) {

    progress = await Progress.create({
      branch: schedule.branch,
      level: schedule.level,
      completedCourses: [],
    });

  }

  //--------------------------------------------------
  // APPROVED -> COMPLETED
  //--------------------------------------------------

  if (
    previousStatus !== "COMPLETED" &&
    status === "COMPLETED"
  ) {

    const exists = progress.completedCourses.some(
      (item) =>
        item.course.toString() ===
        schedule.course.toString()
    );

    if (!exists) {

      progress.completedCourses.push({

        course: schedule.course,

        lecturer: schedule.lecturer,

        schedule: schedule._id,

        completedDate: new Date(),

        manuallyCompleted: false,

      });

      console.log("Course added to progress.");

    }

  }

  //--------------------------------------------------
  // COMPLETED -> Anything Else
  //--------------------------------------------------

  if (
    previousStatus === "COMPLETED" &&
    status !== "COMPLETED"
  ) {

    progress.completedCourses =
      progress.completedCourses.filter(

        (item) =>
          item.course.toString() !==
          schedule.course.toString()

      );

      console.log("Course removed from progress.");

  }

  await progress.save();

}

    await schedule.save();

    const updated = await Schedule.findById(schedule._id)
      .populate("branch")
      .populate("course")
      .populate("lecturer");

    res.json(updated);
  } catch (error) {
    console.error("UPDATE SCHEDULE ERROR");
    console.error(error);

    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  }

  const lecturerDoc = await Lecturer.findById(lecturer);

  if (
    course &&
    lecturer &&
    !lecturerDoc.courses.some((c) => c.toString() === course)
  ) {
    return res.status(400).json({
      message: "Selected lecturer cannot teach this course.",
    });
  }
};

export const approveWeek = async (req, res) => {
  try {
    const week = Number(req.params.week);

    const result = await Schedule.updateMany(
      {
        week,
        status: "DRAFT",
      },
      {
        status: "APPROVED",
      },
    );

    res.json({
      success: true,
      week,
      modified: result.modifiedCount,
      message: `${result.modifiedCount} schedules approved.`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const approveAll = async (req, res) => {
  try {
    const result = await Schedule.updateMany(
      {
        status: "DRAFT",
      },
      {
        status: "APPROVED",
      },
    );

    res.json({
      success: true,
      modified: result.modifiedCount,
      message: `${result.modifiedCount} schedules approved.`,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
