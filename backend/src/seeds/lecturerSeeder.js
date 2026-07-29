import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Lecturer from "../models/Lecturer.js";
import Course from "../models/Course.js";

dotenv.config();

const getCourseIds = async (courseCodes) => {
  const courses = await Course.find({
    code: { $in: courseCodes },
  });

  return courses.map((course) => course._id);
};

const lecturerData = [
  {
    name: "Prof. Bernard",

    phone: "0700000001",

    email: "bernard@npbc.co.ke",

    courseCodes: [
      "ASS006",
      "ASS010",
      "ASS011",
      "DIP003",
      "DIP004",
      "DIP006",
      "DIP010",
      "DIP011",
    ],

    preferredRegions: ["Nairobi", "Kiambu"],

    secondaryRegions: ["Machakos", "Nakuru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. John Kamau",

    phone: "0700000002",

    email: "john@npbc.co.ke",

    courseCodes: [
      "CERT001",
      "CERT002",
      "CERT006",
      "CERT010",
      "ASS001",
      "ASS003",
      "ASS005",
      "DIP001",
    ],

    preferredRegions: ["Nakuru", "Nairobi"],

    secondaryRegions: ["Kiambu", "Nyeri"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Peter Mwangi",

    phone: "0700000003",

    email: "peter@npbc.co.ke",

    courseCodes: [
      "CERT003",
      "CERT004",
      "CERT011",
      "ASS004",
      "ASS009",
      "DIP005",
      "DIP009",
      "DIP011",
    ],

    preferredRegions: ["Nyeri", "Meru"],

    secondaryRegions: ["Nairobi", "Kiambu"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Grace Wanjiku",

    phone: "0700000004",

    email: "grace@npbc.co.ke",

    courseCodes: [
      "CERT005",
      "CERT008",
      "ASS002",
      "ASS006",
      "ASS011",
      "DIP002",
      "DIP010",
      "DIP011",
    ],

    preferredRegions: ["Kisumu", "Kakamega"],

    secondaryRegions: ["Nakuru", "Eldoret"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Samuel Kiptoo",

    phone: "0700000005",

    email: "samuel@npbc.co.ke",

    courseCodes: [
      "CERT002",
      "CERT009",
      "ASS007",
      "ASS010",
      "DIP001",
      "DIP007",
      "DIP008",
      "DIP012",
    ],

    preferredRegions: ["Mombasa", "Nairobi"],

    secondaryRegions: ["Machakos", "Kisumu"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. David Kimani",

    phone: "0700000006",

    email: "david.kimani@npbc.co.ke",

    courseCodes: [
      "CERT004",
      "CERT007",
      "CERT008",
      "ASS005",
      "ASS008",
      "DIP006",
      "DIP009",
      "DIP012",
    ],

    preferredRegions: ["Nairobi", "Kiambu"],

    secondaryRegions: ["Machakos", "Nakuru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Joseph Kariuki",

    phone: "0700000007",

    email: "joseph.kariuki@npbc.co.ke",

    courseCodes: [
      "CERT007",
      "CERT011",
      "ASS008",
      "ASS010",
      "DIP003",
      "DIP005",
      "DIP008",
      "DIP012",
    ],

    preferredRegions: ["Kiambu", "Nairobi"],

    secondaryRegions: ["Nyeri", "Nakuru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  // ---------- CONTINUE WITH PART 2 ----------
  {
    name: "Rev. Daniel Mwangi",

    phone: "0700000008",

    email: "daniel.mwangi@npbc.co.ke",

    courseCodes: [
      "CERT001",
      "CERT003",
      "CERT009",
      "CERT012",
      "ASS001",
      "ASS004",
      "DIP002",
      "DIP004",
    ],

    preferredRegions: ["Nakuru", "Nairobi"],

    secondaryRegions: ["Kiambu", "Nyeri"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. James Njoroge",

    phone: "0700000009",

    email: "james.njoroge@npbc.co.ke",

    courseCodes: [
      "CERT002",
      "CERT006",
      "CERT012",
      "ASS003",
      "ASS006",
      "ASS007",
      "DIP001",
      "DIP007",
    ],

    preferredRegions: ["Nyeri", "Kiambu"],

    secondaryRegions: ["Nairobi", "Meru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Peter Kariuki",

    phone: "0700000010",

    email: "peter.kariuki@npbc.co.ke",

    courseCodes: [
      "CERT003",
      "CERT005",
      "CERT011",
      "ASS002",
      "ASS004",
      "ASS011",
      "DIP005",
      "DIP011",
    ],

    preferredRegions: ["Meru", "Nyeri"],

    secondaryRegions: ["Nairobi", "Kiambu"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Moses Maina",

    phone: "0700000011",

    email: "moses.maina@npbc.co.ke",

    courseCodes: [
      "CERT005",
      "CERT008",
      "CERT010",
      "ASS002",
      "ASS006",
      "DIP002",
      "DIP009",
      "DIP010",
    ],

    preferredRegions: ["Kisumu", "Nakuru"],

    secondaryRegions: ["Nairobi", "Eldoret"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Stephen Karanja",

    phone: "0700000012",

    email: "stephen.karanja@npbc.co.ke",

    courseCodes: [
      "CERT004",
      "CERT006",
      "ASS005",
      "ASS008",
      "ASS009",
      "DIP006",
      "DIP008",
      "DIP012",
    ],

    preferredRegions: ["Mombasa", "Nairobi"],

    secondaryRegions: ["Kiambu", "Machakos"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Isaac Mutua",

    phone: "0700000013",

    email: "isaac.mutua@npbc.co.ke",

    courseCodes: [
      "CERT007",
      "CERT009",
      "ASS007",
      "ASS010",
      "ASS011",
      "DIP003",
      "DIP005",
      "DIP009",
    ],

    preferredRegions: ["Machakos", "Nairobi"],

    secondaryRegions: ["Kiambu", "Mombasa"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Andrew Omondi",

    phone: "0700000014",

    email: "andrew.omondi@npbc.co.ke",

    courseCodes: [
      "CERT008",
      "CERT010",
      "CERT012",
      "ASS008",
      "ASS009",
      "DIP004",
      "DIP007",
      "DIP010",
    ],

    preferredRegions: ["Kisumu", "Kakamega"],

    secondaryRegions: ["Eldoret", "Nakuru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  // ---------- CONTINUE WITH PART 3 ----------
  {
    name: "Rev. Paul Otieno",

    phone: "0700000015",

    email: "paul.otieno@npbc.co.ke",

    courseCodes: [
      "CERT001",
      "CERT009",
      "CERT011",
      "ASS001",
      "ASS006",
      "ASS010",
      "DIP002",
      "DIP010",
    ],

    preferredRegions: ["Kisumu", "Nairobi"],

    secondaryRegions: ["Nakuru", "Eldoret"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Charles Kiprono",

    phone: "0700000016",

    email: "charles.kiprono@npbc.co.ke",

    courseCodes: [
      "CERT002",
      "CERT010",
      "CERT012",
      "ASS002",
      "ASS009",
      "ASS011",
      "DIP001",
      "DIP011",
    ],

    preferredRegions: ["Nakuru", "Eldoret"],

    secondaryRegions: ["Kisumu", "Nairobi"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Michael Waweru",

    phone: "0700000017",

    email: "michael.waweru@npbc.co.ke",

    courseCodes: [
      "CERT003",
      "CERT006",
      "CERT008",
      "ASS003",
      "ASS005",
      "ASS008",
      "DIP003",
      "DIP006",
    ],

    preferredRegions: ["Kiambu", "Nairobi"],

    secondaryRegions: ["Nyeri", "Machakos"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. George Muriithi",

    phone: "0700000018",

    email: "george.muriithi@npbc.co.ke",

    courseCodes: [
      "CERT004",
      "CERT007",
      "CERT009",
      "ASS004",
      "ASS007",
      "ASS010",
      "DIP005",
      "DIP009",
    ],

    preferredRegions: ["Nyeri", "Meru"],

    secondaryRegions: ["Kiambu", "Nairobi"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Francis Njuguna",

    phone: "0700000019",

    email: "francis.njuguna@npbc.co.ke",

    courseCodes: [
      "CERT001",
      "CERT005",
      "CERT011",
      "ASS002",
      "ASS008",
      "ASS011",
      "DIP004",
      "DIP008",
    ],

    preferredRegions: ["Nairobi", "Kiambu"],

    secondaryRegions: ["Machakos", "Nakuru"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },

  {
    name: "Rev. Eliud Kibet",

    phone: "0700000020",

    email: "eliud.kibet@npbc.co.ke",

    courseCodes: [
      "CERT002",
      "CERT007",
      "CERT012",
      "ASS001",
      "ASS009",
      "ASS003",
      "DIP007",
      "DIP012",
    ],

    preferredRegions: ["Eldoret", "Nakuru"],

    secondaryRegions: ["Kisumu", "Nairobi"],

    active: true,

    maxAssignmentsPerMonth: 8,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Lecturer.deleteMany();

    const lecturers = [];

    for (const lecturer of lecturerData) {
      const courseIds = await getCourseIds(lecturer.courseCodes);

      lecturers.push({
        name: lecturer.name,

        phone: lecturer.phone,

        email: lecturer.email,

        courses: courseIds,

        preferredRegions: lecturer.preferredRegions,

        secondaryRegions: lecturer.secondaryRegions,

        active: true,

        maxAssignmentsPerMonth: lecturer.maxAssignmentsPerMonth,

        currentAssignments: 0,
      });
    }

    const inserted = await Lecturer.insertMany(lecturers);

    // addition

    const ass001 = await Course.findOne({ code: "ASS001" });

const alecturers = await Lecturer.find({
  courses: ass001._id,
});

console.log(
  "ASS001 Lecturers:",
  alecturers.map((l) => l.name)
);

// end of addition
    

    console.log(`${inserted.length} lecturers seeded successfully.`);

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();
