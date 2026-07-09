import PendingAssignment from "../models/PendingAssignment.js";
import Schedule from "../models/Schedule.js";

export const getPendingAssignments = async (req, res) => {
  try {

    const pending = await PendingAssignment.find({
      status: "PENDING",
    })
      .populate("branch")
      .populate("suggestedCourse");

    res.json(pending);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const assignPendingAssignment = async (req, res) => {

  try {

    const pending =
      await PendingAssignment.findById(req.params.id);

    if (!pending) {

      return res.status(404).json({
        message: "Pending assignment not found.",
      });

    }

    const {
      course,
      lecturer,
      status,
    } = req.body;

    const schedule = await Schedule.create({

      year: pending.year,

      month: pending.month,

      week: pending.week,

      branch: pending.branch,

      level: pending.level,

      course,

      lecturer,

      status: status || "DRAFT",

    });

    await PendingAssignment.findByIdAndDelete(
      pending._id
    );

    res.status(201).json(schedule);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};