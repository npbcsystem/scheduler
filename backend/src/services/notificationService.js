import Schedule from "../models/Schedule.js";
import { sendSMS } from "./smsService.js";

const formatPhone = (phone) => {
  if (!phone) return null;

  let value = String(phone).trim();

  // 0712345678 -> 254712345678
  if (value.startsWith("0")) {
    return `254${value.substring(1)}`;
  }

  // +254712345678 -> 254712345678
  if (value.startsWith("+")) {
    return value.substring(1);
  }

  return value;
};

export const notifyWeek = async ({
  week,
  month,
  year,
}) => {
  const schedules = await Schedule.find({
    week: Number(week),
    month: Number(month),
    year: Number(year),
    status: {
      $in: ["APPROVED", "COMPLETED"],
    },
  })
    .populate("branch")
    .populate("course")
    .populate("lecturer");

  const recipients = new Map();

  // --------------------------------------------------
  // Build recipients
  // --------------------------------------------------

  for (const schedule of schedules) {
    const branch = schedule.branch;
    const course = schedule.course;
    const lecturer = schedule.lecturer;

    if (!branch) continue;

    // ----------------------------------------------
    // Lecturer
    // ----------------------------------------------

    if (lecturer?.phone) {
      const phone =
        formatPhone(lecturer.phone);

      if (phone) {
        const message =
          `NPBC: You are scheduled to teach ` +
          `${course?.name || "a course"} ` +
          `at ${branch.name} Branch ` +
          `for Week ${week}, ` +
          `${month}/${year}. ` +
          `Please confirm your availability.`;

        const key = `LECTURER-${phone}`;

        if (!recipients.has(key)) {
          recipients.set(key, {
            phone,
            name: lecturer.name,
            type: "LECTURER",
            messages: [],
          });
        }

        recipients
          .get(key)
          .messages.push(message);
      }
    }

    // ----------------------------------------------
    // Branch Coordinator
    // ----------------------------------------------

    if (branch.coordinatorPhone) {
      const phone =
        formatPhone(
          branch.coordinatorPhone
        );

      if (phone) {
        const message =
          `NPBC: ${branch.name} is scheduled ` +
          `for ${course?.name || "a class"} ` +
          `during Week ${week}, ${month}/${year}. ` +
          `Lecturer: ${lecturer?.name || "Not assigned"}. ` +
          `Please coordinate the class.`;

        const key =
          `COORDINATOR-${phone}-${branch._id}`;

        if (!recipients.has(key)) {
          recipients.set(key, {
            phone,
            name:
              branch.coordinatorName ||
              "Coordinator",
            type: "COORDINATOR",
            branch: branch.name,
            messages: [],
          });
        }

        recipients
          .get(key)
          .messages.push(message);
      }
    }
  }

  // --------------------------------------------------
  // Send SMS
  // --------------------------------------------------

  const results = [];

  for (const recipient of recipients.values()) {
    try {
      // For now, send one SMS per assignment.
      // We can optimize/group these later.
      for (const message of recipient.messages) {
        const result = await sendSMS(
          recipient.phone,
          message
        );

        results.push({
          ...recipient,
          message,
          status: "SENT",
          result,
        });
      }
    } catch (error) {
      results.push({
        ...recipient,
        status: "FAILED",
        error: error.message,
      });
    }
  }

  return {
    success: true,

    week: Number(week),

    month: Number(month),

    year: Number(year),

    schedules: schedules.length,

    recipients: recipients.size,

    sent: results.filter(
      (item) =>
        item.status === "SENT"
    ).length,

    failed: results.filter(
      (item) =>
        item.status === "FAILED"
    ).length,

    results,
  };
};