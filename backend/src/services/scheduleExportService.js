import Schedule from "../models/Schedule.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// --------------------------------------------------
// File Path Setup
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update this path to where your logo image is stored in your project
const LOGO_PATH = path.join(__dirname, "../assets/npbc-logo-2.png");

// --------------------------------------------------
// Level labels
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
      return level || "";
  }
};

// --------------------------------------------------
// Format phone
// --------------------------------------------------

const displayPhone = (phone) => {
  if (!phone) return "";

  let value = String(phone)
    .trim()
    .replace(/[\s-]/g, "");

  if (value.startsWith("254")) {
    return `+${value}`;
  }

  if (value.startsWith("0")) {
    return `+254${value.substring(1)}`;
  }

  if (value.startsWith("+")) {
    return value;
  }

  return value;
};

// --------------------------------------------------
// Get schedules
// --------------------------------------------------

export const getSchedulesForExport = async ({
  week,
  month,
  year,
}) => {
  const query = {
    month: Number(month),
    year: Number(year),
  };

  if (week !== "ALL") {
    query.week = Number(week);
  }

  const schedules =
    await Schedule.find(query)
      .populate("branch")
      .populate("course")
      .populate("lecturer")
      .sort({
        week: 1,
        "branch.name": 1,
        level: 1,
      });

  return schedules;
};

// --------------------------------------------------
// Excel
// --------------------------------------------------

export const generateExcel = async ({
  schedules,
  month,
  year,
  week,
}) => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Nairobi Pentecostal Bible College";
  workbook.created = new Date();

  // Load logo buffer if file exists
  const hasLogo = fs.existsSync(LOGO_PATH);
  const logoBuffer = hasLogo ? fs.readFileSync(LOGO_PATH) : null;

  // ==================================================
  // Schedule sheet
  // ==================================================

  const worksheet = workbook.addWorksheet("Schedule");

  // Adjust header row heights to accommodate logo
  worksheet.getRow(1).height = 32;
  worksheet.getRow(2).height = 24;

  if (hasLogo) {
    const logoImage = workbook.addImage({
      buffer: logoBuffer,
      extension: "png",
    });

    // Embed logo at cell A1 (Top-Left)
    worksheet.addImage(logoImage, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 45, height: 38 },
    });
  }

  worksheet.mergeCells("A1:L1");

  worksheet.getCell("A1").value =
    "NAIROBI PENTECOSTAL BIBLE COLLEGE";

  worksheet.getCell("A1").font = {
    bold: true,
    size: 16,
  };

  worksheet.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  worksheet.mergeCells("A2:L2");

  const monthName = new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleString("en-US", {
    month: "long",
  });

  worksheet.getCell("A2").value =
    week === "ALL"
      ? `CLASS SCHEDULE — ${monthName} ${year}`
      : `CLASS SCHEDULE — ${monthName} ${year} — WEEK ${week}`;

  worksheet.getCell("A2").font = {
    bold: true,
    size: 13,
  };

  worksheet.getCell("A2").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  const headers = [
    "Week",
    "Branch",
    "County",
    "Level",
    "Course Code",
    "Course",
    "Lecturer",
    "Lecturer Phone",
    "Coordinator",
    "Coordinator Phone",
    "Status",
    "Source",
  ];

  const headerRow = worksheet.addRow(headers);

  headerRow.font = {
    bold: true,
  };

  headerRow.alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  for (const schedule of schedules) {
    worksheet.addRow([
      schedule.week,
      schedule.branch?.name || "",
      schedule.branch?.region || "",
      getLevelLabel(schedule.level),
      schedule.course?.code || "",
      schedule.course?.name || "",
      schedule.lecturer?.name || "Not Assigned",
      displayPhone(schedule.lecturer?.phone),
      schedule.branch?.coordinatorName || "",
      displayPhone(schedule.branch?.coordinatorPhone),
      schedule.status,
      schedule.source,
    ]);
  }

  worksheet.columns = [
    { width: 8 },
    { width: 24 },
    { width: 18 },
    { width: 12 },
    { width: 15 },
    { width: 30 },
    { width: 25 },
    { width: 18 },
    { width: 25 },
    { width: 20 },
    { width: 14 },
    { width: 12 },
  ];

  worksheet.views = [
    {
      state: "frozen",
      ySplit: 3,
    },
  ];

  worksheet.autoFilter = {
    from: "A3",
    to: `L${worksheet.rowCount}`,
  };

  // ==================================================
  // Summary sheet
  // ==================================================

  const summary = workbook.addWorksheet("Summary");

  summary.getRow(1).height = 30;

  if (hasLogo) {
    const summaryLogo = workbook.addImage({
      buffer: logoBuffer,
      extension: "png",
    });

    summary.addImage(summaryLogo, {
      tl: { col: 0.1, row: 0.1 },
      ext: { width: 40, height: 34 },
    });
  }

  summary.mergeCells("A1:D1");

  summary.getCell("A1").value =
    "NPBC SCHEDULE SUMMARY";

  summary.getCell("A1").font = {
    bold: true,
    size: 16,
  };

  summary.getCell("A1").alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  summary.addRow([]);

  summary.addRow([
    "Period",
    week === "ALL"
      ? `${monthName} ${year}`
      : `${monthName} ${year} — Week ${week}`,
  ]);

  summary.addRow([
    "Total Classes",
    schedules.length,
  ]);

  const branches = new Set(
    schedules
      .map((item) => item.branch?._id?.toString())
      .filter(Boolean)
  );

  const lecturers = new Set(
    schedules
      .map((item) => item.lecturer?._id?.toString())
      .filter(Boolean)
  );

  summary.addRow(["Branches", branches.size]);
  summary.addRow(["Lecturers", lecturers.size]);

  summary.addRow([]);

  summary.addRow(["Week", "Classes"]);

  const weekCounts = {};

  schedules.forEach((schedule) => {
    weekCounts[schedule.week] =
      (weekCounts[schedule.week] || 0) + 1;
  });

  Object.keys(weekCounts)
    .sort((a, b) => Number(a) - Number(b))
    .forEach((weekNumber) => {
      summary.addRow([
        `Week ${weekNumber}`,
        weekCounts[weekNumber],
      ]);
    });

  summary.columns = [
    { width: 25 },
    { width: 30 },
    { width: 20 },
    { width: 20 },
  ];

  return workbook.xlsx.writeBuffer();
};

// --------------------------------------------------
// PDF
// --------------------------------------------------

export const generatePDF = ({
  schedules,
  month,
  year,
  week,
}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margins: {
        top: 30,
        bottom: 40,
        left: 30,
        right: 30,
      },
    });

    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const monthName = new Date(
      Number(year),
      Number(month) - 1,
      1
    ).toLocaleString("en-US", {
      month: "long",
    });

    // ----------------------------------------------
    // Header & Logo
    // ----------------------------------------------

    if (fs.existsSync(LOGO_PATH)) {
      const logoWidth = 50;
      const logoX = (doc.page.width - logoWidth) / 2;
      
      // Draw centered logo at the top
      doc.image(LOGO_PATH, logoX, 20, { width: logoWidth });
      doc.y = 65;
    } else {
      doc.y = 30;
    }

    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("NAIROBI PENTECOSTAL BIBLE COLLEGE", {
        align: "center",
      });

    doc
      .moveDown(0.3)
      .fontSize(11)
      .text(
        week === "ALL"
          ? `CLASS SCHEDULE — ${monthName} ${year}`
          : `CLASS SCHEDULE — ${monthName} ${year} — WEEK ${week}`,
        {
          align: "center",
        }
      );

    doc.moveDown(0.8);

    // ----------------------------------------------
    // Table Config
    // ----------------------------------------------

    const columns = [
      { title: "Week", width: 35 },
      { title: "Branch", width: 105 },
      { title: "Level", width: 45 },
      { title: "Course", width: 125 },
      { title: "Lecturer", width: 105 },
      { title: "Lecturer Phone", width: 85 },
      { title: "Coordinator", width: 90 },
      { title: "Status", width: 65 },
    ];

    const startX = 30;
    let y = doc.y;
    const rowHeight = 25;

    // ----------------------------------------------
    // Header row
    // ----------------------------------------------

    let x = startX;

    doc.font("Helvetica-Bold").fontSize(8);

    columns.forEach((column) => {
      doc
        .rect(x, y, column.width, rowHeight)
        .stroke();

      doc.text(column.title, x + 3, y + 8, {
        width: column.width - 6,
        align: "center",
      });

      x += column.width;
    });

    y += rowHeight;

    // ----------------------------------------------
    // Data rows
    // ----------------------------------------------

    doc.font("Helvetica");

    schedules.forEach((schedule) => {
      if (y > doc.page.height - 70) {
        doc.addPage();

        y = 30;

        let headerX = startX;

        doc.font("Helvetica-Bold").fontSize(8);

        columns.forEach((column) => {
          doc
            .rect(headerX, y, column.width, rowHeight)
            .stroke();

          doc.text(column.title, headerX + 3, y + 8, {
            width: column.width - 6,
            align: "center",
          });

          headerX += column.width;
        });

        y += rowHeight;

        doc.font("Helvetica");
      }

      const values = [
        schedule.week,
        schedule.branch?.name || "",
        getLevelLabel(schedule.level),
        schedule.course?.name || "",
        schedule.lecturer?.name || "Not Assigned",
        displayPhone(schedule.lecturer?.phone),
        schedule.branch?.coordinatorName || "",
        schedule.status,
      ];

      let rowX = startX;

      values.forEach((value, index) => {
        const column = columns[index];

        doc
          .rect(rowX, y, column.width, rowHeight)
          .stroke();

        doc.text(String(value || ""), rowX + 3, y + 7, {
          width: column.width - 6,
          height: rowHeight - 4,
          ellipsis: true,
          align:
            index === 0 || index === 2 || index === 7
              ? "center"
              : "left",
        });

        rowX += column.width;
      });

      y += rowHeight;
    });

    // ----------------------------------------------
    // Footer
    // ----------------------------------------------

    doc
      .fontSize(8)
      .font("Helvetica")
      .text(
        `Generated ${new Date().toLocaleString()}`,
        30,
        doc.page.height - 35
      );

    doc.end();
  });
};