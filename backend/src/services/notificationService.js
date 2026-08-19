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

    // Only notify approved upcoming classes
    status: "APPROVED",
  })
    .populate("branch")
    .populate("course")
    .populate("lecturer");

  // --------------------------------------------------
  // Separate recipients
  // --------------------------------------------------

  const lecturerRecipients = new Map();
  const coordinatorRecipients = new Map();

  // --------------------------------------------------
  // Build notifications
  // --------------------------------------------------

  for (const schedule of schedules) {
    const branch = schedule.branch;
    const course = schedule.course;
    const lecturer = schedule.lecturer;

    if (!branch) continue;

    // ==================================================
    // LECTURER
    // One lecturer = one class
    // ==================================================

    if (lecturer?.phone) {
      const phone = formatPhone(lecturer.phone);

      if (phone) {
        const message =
          `NPBC: You are scheduled to teach ` +
          `${course?.name || "a course"} ` +
          `at ${branch.name} Branch ` +
          `during Week ${week}, ${month}/${year}. ` +
          `Please confirm your availability.`;

        // Use schedule ID so every assignment is distinct
        const key = `LECTURER-${schedule._id}`;

        lecturerRecipients.set(key, {
          phone,
          name: lecturer.name,
          type: "LECTURER",
          branch: branch.name,
          course: course?.name || "Unknown",
          message,
        });
      }
    }

    // ==================================================
    // COORDINATOR
    // One coordinator gets ONE message for their branch
    // ==================================================

    if (branch.coordinatorPhone) {
      const phone = formatPhone(
        branch.coordinatorPhone,
      );

      if (phone) {
        const key = `COORDINATOR-${branch._id}`;

        if (!coordinatorRecipients.has(key)) {
          coordinatorRecipients.set(key, {
            phone,
            name:
              branch.coordinatorName ||
              "Coordinator",
            type: "COORDINATOR",
            branch: branch.name,
            classes: [],
          });
        }

        coordinatorRecipients
          .get(key)
          .classes.push({
            level: schedule.level,
            course:
              course?.name ||
              "Unknown Course",
            lecturer:
              lecturer?.name ||
              "Not assigned",
          });
      }
    }
  }

  // --------------------------------------------------
  // Create coordinator messages
  // --------------------------------------------------

  const coordinatorMessages = [];

  for (const coordinator of coordinatorRecipients.values()) {
    const classDetails =
      coordinator.classes
        .map(
          (item) =>
            `${item.level}: ${item.course} ` +
            `(${item.lecturer})`,
        )
        .join("; ");

    const message =
      `NPBC: ${coordinator.branch} classes ` +
      `for Week ${week}, ${month}/${year}: ` +
      `${classDetails}. ` +
      `Please coordinate accordingly.`;

    coordinatorMessages.push({
      ...coordinator,
      message,
    });
  }

  // --------------------------------------------------
  // Combine lecturer + coordinator notifications
  // --------------------------------------------------

  const notifications = [
    ...lecturerRecipients.values(),
    ...coordinatorMessages,
  ];

  // --------------------------------------------------
  // Send SMS
  // --------------------------------------------------

  const results = [];

  for (const notification of notifications) {
    try {
      console.log(
        `Sending SMS to ${notification.name} ` +
        `(${notification.phone})`,
      );

      const result = await sendSMS(
        notification.phone,
        notification.message,
      );

      results.push({
        phone: notification.phone,
        name: notification.name,
        type: notification.type,
        branch: notification.branch,
        message: notification.message,
        status: "SENT",
        result,
      });

    } catch (error) {
      console.error(
        `SMS FAILED: ${notification.name}`,
        error,
      );

      results.push({
        phone: notification.phone,
        name: notification.name,
        type: notification.type,
        branch: notification.branch,
        message: notification.message,
        status: "FAILED",
        error: error.message,
      });
    }
  }

  // --------------------------------------------------
  // Summary
  // --------------------------------------------------

  const sent = results.filter(
    (item) => item.status === "SENT",
  ).length;

  const failed = results.filter(
    (item) => item.status === "FAILED",
  ).length;

  return {
    success: true,

    week: Number(week),

    month: Number(month),

    year: Number(year),

    schedules: schedules.length,

    recipients: notifications.length,

    sent,

    failed,

    results,
  };
};