import {
  notifyWeek,
} from "../services/notificationService.js";

export const notifyWeekController =
  async (req, res) => {
    try {
      const {
        week,
        month,
        year,
      } = req.body;

      if (!week || !month || !year) {
        return res.status(400).json({
          message:
            "Week, month and year are required.",
        });
      }

      const result =
        await notifyWeek({
          week,
          month,
          year,
        });

      res.json(result);
    } catch (error) {
      console.error(
        "NOTIFY WEEK ERROR:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  };