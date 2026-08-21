import Schedule from "../models/Schedule.js";
import { sendSMS } from "./smsService.js";

// --------------------------------------------------
// Format Kenyan phone number
// --------------------------------------------------

const formatPhone = (phone) => {
  if (!phone) return null;

  let value = String(phone)
    .trim()
    .replace(/[\s-]/g, "");

  // 0714590488 -> 254714590488
  if (value.startsWith("0")) {
    return `254${value.substring(1)}`;
  }

  // +254714590488 -> 254714590488
  if (value.startsWith("+")) {
    return value.substring(1);
  }

  return value;
};

// --------------------------------------------------
// Get actual Saturday for the selected week/month/year
// --------------------------------------------------

const getSaturdayForWeek = (
  week,
  month,
  year
) => {
  const firstDay = new Date(
    Number(year),
    Number(month) - 1,
    1
  );

  // Find first Saturday of the month
  const firstSaturday =
    1 +
    ((6 - firstDay.getDay() + 7) % 7);

  const saturdayDate =
    firstSaturday +
    (Number(week) - 1) * 7;

  const date = new Date(
    Number(year),
    Number(month) - 1,
    saturdayDate
  );

  const day =
    String(date.getDate()).padStart(2, "0");

  const monthNumber =
    String(date.getMonth() + 1).padStart(
      2,
      "0"
    );

  const actualYear =
    date.getFullYear();

  return `${day}/${monthNumber}/${actualYear}`;
};

// --------------------------------------------------
// Level display
// --------------------------------------------------

const getLevelLabel = (level) => {
  switch (level) {
    case "CERTIFICATE":
      return "Lev. 1";

    case "ASSOCIATE":
      return "Lev. 2";

    case "DIPLOMA":
      return "Lev. 3";

    default:
      return level;
  }
};

// --------------------------------------------------
// Notify Week
// --------------------------------------------------

export const notifyWeek = async ({
  week,
  month,
  year,
}) => {
  const schedules =
    await Schedule.find({
      week: Number(week),
      month: Number(month),
      year: Number(year),

      status: {
        $in: [
          "APPROVED",
          "COMPLETED",
        ],
      },
    })
      .populate("branch")
      .populate("course")
      .populate("lecturer");

  // --------------------------------------------------
  // Actual Saturday
  // --------------------------------------------------

  const saturdayDate =
    getSaturdayForWeek(
      week,
      month,
      year
    );

  // --------------------------------------------------
  // Group coordinator messages by branch
  // --------------------------------------------------

  const coordinatorGroups =
    new Map();

  // --------------------------------------------------
  // Lecturer recipients
  // --------------------------------------------------

  const lecturerRecipients =
    new Map();

  // --------------------------------------------------
  // Process schedules
  // --------------------------------------------------

  for (const schedule of schedules) {
    const branch =
      schedule.branch;

    const course =
      schedule.course;

    const lecturer =
      schedule.lecturer;

    if (!branch || !course) {
      continue;
    }

    // ==================================================
    // LECTURER MESSAGE
    // ==================================================

    if (lecturer?.phone) {
      const phone =
        formatPhone(
          lecturer.phone
        );

      if (phone) {
        const coordinatorPhone =
          formatPhone(
            branch.coordinatorPhone
          );

        const message =
          `Praise the Lord and hope you are well. ` +
          `This Saturday  ${saturdayDate} plan for ` +
          `${course.name || "your class"} ` +
          `at ${branch.name}. ` +
          `Coordinator: +${coordinatorPhone || "N/A"}. ` +
          `Kindly confirm on time and remember to submit ` +
          `the class reports on Monday before 4:00 PM. ` +
          `Blessings. ` +
          `For inquiries, call ODEL 0115008558`;

        const key =
          `LECTURER-${phone}`;

        if (
          !lecturerRecipients.has(
            key
          )
        ) {
          lecturerRecipients.set(
            key,
            {
              phone,
              name:
                lecturer.name,
              type: "LECTURER",
              messages: [],
            }
          );
        }

        lecturerRecipients
          .get(key)
          .messages.push(
            message
          );
      }
    }

    // ==================================================
    // COORDINATOR MESSAGE
    // ==================================================

    if (
      branch.coordinatorPhone
    ) {
      const phone =
        formatPhone(
          branch.coordinatorPhone
        );

      if (phone) {
        const key =
          `${branch._id}-${phone}`;

        if (
          !coordinatorGroups.has(
            key
          )
        ) {
          coordinatorGroups.set(
            key,
            {
              phone,
              name:
                branch.coordinatorName ||
                "Coordinator",
              type:
                "COORDINATOR",
              branch:
                branch.name,
              classes: [],
            }
          );
        }

        coordinatorGroups
          .get(key)
          .classes.push({
            level:
              schedule.level,

            course:
              course.name ||
              "Unknown Course",

            lecturer:
              lecturer?.name ||
              "Not assigned",

            lecturerPhone:
              lecturer?.phone
                ? formatPhone(
                    lecturer.phone
                  )
                : null,
          });
      }
    }
  }

  // --------------------------------------------------
  // Build coordinator SMS
  // --------------------------------------------------

  const coordinatorRecipients =
    [];

  for (const coordinator of coordinatorGroups.values()) {
    // Sort:
    // Certificate -> Associate -> Diploma

    const levelOrder = {
      CERTIFICATE: 1,
      ASSOCIATE: 2,
      DIPLOMA: 3,
    };

    coordinator.classes.sort(
      (a, b) =>
        (levelOrder[a.level] ||
          99) -
        (levelOrder[b.level] ||
          99)
    );

    let message =
      `Shalom, Week ${week} Saturday Class ${saturdayDate}\n`;

    for (const classItem of coordinator.classes) {
      message +=
        `${getLevelLabel(
          classItem.level
        )} ` +
        `${classItem.course} - ` +
        `${classItem.lecturer}`;

      if (
        classItem.lecturerPhone
      ) {
        message +=
          ` +${classItem.lecturerPhone}`;
      }

      message += "\n";
    }

    message +=
      `Blessings.\n` +
      `For inquiries, call ODEL 0115008558`;

    coordinatorRecipients.push({
      ...coordinator,
      message,
    });
  }

  // --------------------------------------------------
  // Send SMS
  // --------------------------------------------------

  const results = [];

  // --------------------------------------------------
  // Send lecturer messages
  // --------------------------------------------------

  for (
    const recipient of lecturerRecipients.values()
  ) {
    for (
      const message of recipient.messages
    ) {
      try {
        const result =
          await sendSMS(
            recipient.phone,
            message
          );

        results.push({
          phone:
            recipient.phone,

          name:
            recipient.name,

          type:
            recipient.type,

          message,

          status: "SENT",

          result,
        });
      } catch (error) {
        results.push({
          phone:
            recipient.phone,

          name:
            recipient.name,

          type:
            recipient.type,

          message,

          status: "FAILED",

          error:
            error.message,
        });
      }
    }
  }

  // --------------------------------------------------
  // Send coordinator messages
  // --------------------------------------------------

  for (
    const recipient of coordinatorRecipients
  ) {
    try {
      const result =
        await sendSMS(
          recipient.phone,
          recipient.message
        );

      results.push({
        phone:
          recipient.phone,

        name:
          recipient.name,

        type:
          recipient.type,

        branch:
          recipient.branch,

        message:
          recipient.message,

        status: "SENT",

        result,
      });
    } catch (error) {
      results.push({
        phone:
          recipient.phone,

        name:
          recipient.name,

        type:
          recipient.type,

        branch:
          recipient.branch,

        message:
          recipient.message,

        status: "FAILED",

        error:
          error.message,
      });
    }
  }

  // --------------------------------------------------
  // Return result
  // --------------------------------------------------

  return {
    success: true,

    week:
      Number(week),

    month:
      Number(month),

    year:
      Number(year),

    saturdayDate,

    schedules:
      schedules.length,

    recipients:
      lecturerRecipients.size +
      coordinatorRecipients.length,

    sent:
      results.filter(
        (item) =>
          item.status === "SENT"
      ).length,

    failed:
      results.filter(
        (item) =>
          item.status === "FAILED"
      ).length,

    results,
  };
};