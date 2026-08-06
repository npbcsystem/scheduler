import { generateSchedule } from "../services/schedulerService.js";
import Schedule from "../models/Schedule.js";

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
      message: error.message
    });

  }
};

// update lecturer's current assignments
export const updateSchedule = async (req, res) => {

    try {

        const schedule =
            await Schedule.findById(
                req.params.id
            );

        if (!schedule) {

            return res.status(404).json({

                message:
                    "Schedule not found"

            });

        }

        schedule.lecturer =
            req.body.lecturer;

        schedule.status =
            req.body.status;

        await schedule.save();

        res.json(schedule);

    }

    catch (error) {

        res.status(500).json({

            message:error.message

        });

    }

};
