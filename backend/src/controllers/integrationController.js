
import Schedule from "../models/Schedule.js";
import Lecturer from "../models/Lecturer.js";

export const getIntegrationLecturers = async (_req, res) => {
  try {
    const records = await Lecturer.find()
      .select("name email phone courses preferredRegions secondaryRegions active maxAssignmentsPerMonth")
      .populate("courses", "name code level")
      .sort({ name: 1, _id: 1 });

    const lecturers = records.map((lecturer) => ({
      id: String(lecturer._id),
      name: lecturer.name,
      email: lecturer.email || null,
      phone: lecturer.phone || null,
      active: lecturer.active,
      courses: lecturer.courses.map((course) => ({
        id: String(course._id),
        name: course.name,
        code: course.code || null,
        level: course.level || null,
      })),
      preferredRegions: lecturer.preferredRegions,
      secondaryRegions: lecturer.secondaryRegions,
      maxAssignmentsPerMonth: lecturer.maxAssignmentsPerMonth,
    }));

    res.json({ success: true, totalLecturers: lecturers.length, lecturers });
  } catch (error) {
    console.error("INTEGRATION LECTURERS ERROR:", error);
    res.status(500).json({ success: false, message: "Unable to retrieve lecturers." });
  }
};

// Get the current date in the Nairobi timezone
const getNairobiDate = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value])
  );

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
  };
};

// Calculate the Saturday of the current calendar week
const getSaturday = (offsetWeeks = 0) => {
  const { year, month, day } = getNairobiDate();

  const date = new Date(Date.UTC(year, month - 1, day));

  const dayOfWeek = date.getUTCDay();

  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;

  date.setUTCDate(
    date.getUTCDate() + daysUntilSaturday + offsetWeeks * 7
  );

  const targetYear = date.getUTCFullYear();
  const targetMonth = date.getUTCMonth() + 1;
  const targetDay = date.getUTCDate();

  return {
    year: targetYear,
    month: targetMonth,
    day: targetDay,
    week: Math.ceil(targetDay / 7),
    date: [
      targetYear,
      String(targetMonth).padStart(2, "0"),
      String(targetDay).padStart(2, "0"),
    ].join("-"),
  };
};

export const getCurrentAndNextSchedules = async (req, res) => {
  try {
    const currentSaturday = getSaturday(0);
    const nextSaturday = getSaturday(1);

    const periods = [
      {
        type: "CURRENT_WEEK",
        ...currentSaturday,
      },
      {
        type: "NEXT_WEEK",
        ...nextSaturday,
      },
    ];

    const schedules = await Schedule.find({
      status: "APPROVED",
      $or: periods.map((period) => ({
        year: period.year,
        month: period.month,
        week: period.week,
      })),
    })
      .populate("branch", "name region coordinatorName coordinatorPhone")
      .populate("course", "name code level programme")
      .populate("lecturer", "name phone email")
      .sort({ year: 1, month: 1, week: 1 });

    const formattedSchedules = schedules.map((schedule) => {
      const period = periods.find(
        (item) =>
          item.year === schedule.year &&
          item.month === schedule.month &&
          item.week === schedule.week
      );

      return {
        branch: schedule.branch?.name || null,
        region: schedule.branch?.region || null,

        course: schedule.course?.name || null,
        courseCode: schedule.course?.code || null,

        trainer: schedule.lecturer?.name || null,
        trainerPhone: schedule.lecturer?.phone || null,

        week: schedule.week,
        weekLabel: `Week ${schedule.week}`,
        weekType: period?.type || null,

        date: period?.date || null,

        startTime: "08:00",
        endTime: "16:00",

        mode: "PHYSICAL",

        level: schedule.level,

        coordinator: schedule.branch?.coordinatorName || null,
        coordinatorPhone: schedule.branch?.coordinatorPhone || null,

        status: schedule.status,
      };
    });

    res.json({
      success: true,
      timezone: "Africa/Nairobi",

      period: {
        currentWeek: currentSaturday.date,
        nextWeek: nextSaturday.date,
      },

      totalSchedules: formattedSchedules.length,

      schedules: formattedSchedules,
    });
  } catch (error) {
    console.error("INTEGRATION API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve schedules.",
    });
  }
};
