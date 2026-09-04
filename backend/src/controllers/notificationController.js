import { notifyWeek } from "../services/notificationService.js";

export const notifyWeekController = async (req, res) => {
  try {
    const { week, month, year, recipients } = req.body;

    if (!week || !month || !year) {
      return res.status(400).json({
        message: "Week, month and year are required.",
      });
    }

    if (!recipients || (!recipients.lecturers && !recipients.coordinators)) {
      return res.status(400).json({
        message: "Select at least one notification recipient.",
      });
    }

    const result = await notifyWeek({
      week,
      month,
      year,
      recipients,
    });

    res.json(result);
  } catch (error) {
    console.error("NOTIFY WEEK ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
