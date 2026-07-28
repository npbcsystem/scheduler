import dotenv from "dotenv";
import connectDB from "../config/db.js";

import Lecturer from "../models/Lecturer.js";
import Course from "../models/Course.js";

dotenv.config();


const getCourseIds = async (courseCodes) => {
  const courses = await Course.find({
    code: { $in: courseCodes }
  });

  return courses.map(course => course._id);
};

const lecturerData = [

{
    name: "Prof. Bernard",

    phone: "0700000001",

    email: "bernard@npbc.co.ke",

    courseCodes: [
        "DIP003",
        "DIP004",
        "ASS010",
        "ASS006",
        "DIP010"
    ],

    preferredRegions: [
        "Nairobi"
    ],

    secondaryRegions: [
        "Kiambu",
        "Machakos"
    ],

    availability: [1,2,3,4],

    maxAssignmentsPerMonth: 5
},

{
    name: "Rev. John Kamau",

    phone: "0700000002",

    email: "john@npbc.co.ke",

    courseCodes: [
        "CERT001",
        "CERT006",
        "CERT010",
        "ASS001",
        "ASS003"
    ],

    preferredRegions: [
        "Nakuru"
    ],

    secondaryRegions: [
        "Nairobi"
    ],

    availability: [1,2,4],

    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Peter Mwangi",

    phone: "0700000003",

    email: "peter@npbc.co.ke",

    courseCodes: [
        "CERT003",
        "CERT011",
        "ASS004",
        "ASS009",
        "DIP005"
    ],

    preferredRegions: [
        "Nyeri"
    ],

    secondaryRegions: [
        "Nairobi"
    ],

    availability: [1,3,4],

    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Grace Wanjiku",

    phone: "0700000004",

    email: "grace@npbc.co.ke",

    courseCodes: [
        "CERT005",
        "ASS002",
        "ASS011",
        "DIP002",
        "DIP011"
    ],

    preferredRegions: [
        "Kisumu"
    ],

    secondaryRegions: [
        "Nakuru"
    ],

    availability: [2,3,4],

    maxAssignmentsPerMonth: 3
},

{
    name: "Rev. Samuel Kiptoo",

    phone: "0700000005",

    email: "samuel@npbc.co.ke",

    courseCodes: [
        "CERT002",
        "CERT009",
        "ASS007",
        "DIP001",
        "DIP007"
    ],

    preferredRegions: [
        "Mombasa"
    ],

    secondaryRegions: [
        "Nairobi"
    ],

    availability: [1,2,3,4],

    maxAssignmentsPerMonth: 5
},
{
    name: "Rev. David Kimani",
    phone: "0700000006",
    email: "david.kimani@npbc.co.ke",
    courseCodes: ["CERT004","CERT008","ASS005","DIP006","DIP009"],
    preferredRegions: ["Nairobi"],
    secondaryRegions: ["Kiambu"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Joseph Kariuki",
    phone: "0700000007",
    email: "joseph.kariuki@npbc.co.ke",
    courseCodes: ["CERT007","ASS008","ASS010","DIP003","DIP008"],
    preferredRegions: ["Kiambu"],
    secondaryRegions: ["Nairobi"],
    availability: [1,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Daniel Mwangi",
    phone: "0700000008",
    email: "daniel.mwangi@npbc.co.ke",
    courseCodes: ["CERT001","CERT009","ASS001","DIP004","DIP010"],
    preferredRegions: ["Nakuru"],
    secondaryRegions: ["Nairobi"],
    availability: [2,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. James Njoroge",
    phone: "0700000009",
    email: "james.njoroge@npbc.co.ke",
    courseCodes: ["CERT002","ASS003","ASS006","DIP001","DIP007"],
    preferredRegions: ["Nyeri"],
    secondaryRegions: ["Kiambu"],
    availability: [1,2,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Peter Kariuki",
    phone: "0700000010",
    email: "peter.kariuki@npbc.co.ke",
    courseCodes: ["CERT003","ASS004","ASS011","DIP005","DIP011"],
    preferredRegions: ["Meru"],
    secondaryRegions: ["Nyeri"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 5
},

{
    name: "Rev. Moses Maina",
    phone: "0700000011",
    email: "moses.maina@npbc.co.ke",
    courseCodes: ["CERT005","CERT010","ASS002","DIP002","DIP009"],
    preferredRegions: ["Kisumu"],
    secondaryRegions: ["Nakuru"],
    availability: [2,3,4],
    maxAssignmentsPerMonth: 3
},

{
    name: "Rev. Stephen Karanja",
    phone: "0700000012",
    email: "stephen.karanja@npbc.co.ke",
    courseCodes: ["CERT006","ASS005","ASS009","DIP006","DIP008"],
    preferredRegions: ["Mombasa"],
    secondaryRegions: ["Nairobi"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 5
},

{
    name: "Rev. Isaac Mutua",
    phone: "0700000013",
    email: "isaac.mutua@npbc.co.ke",
    courseCodes: ["CERT007","ASS007","ASS010","DIP003","DIP005"],
    preferredRegions: ["Machakos"],
    secondaryRegions: ["Nairobi"],
    availability: [1,2,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Andrew Omondi",
    phone: "0700000014",
    email: "andrew.omondi@npbc.co.ke",
    courseCodes: ["CERT008","ASS008","ASS011","DIP004","DIP007"],
    preferredRegions: ["Kisumu"],
    secondaryRegions: ["Kakamega"],
    availability: [2,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Paul Otieno",
    phone: "0700000015",
    email: "paul.otieno@npbc.co.ke",
    courseCodes: ["CERT009","ASS001","ASS006","DIP002","DIP010"],
    preferredRegions: ["Kisumu"],
    secondaryRegions: ["Nairobi"],
    availability: [1,2,3],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Charles Kiprono",
    phone: "0700000016",
    email: "charles.kiprono@npbc.co.ke",
    courseCodes: ["CERT010","ASS002","ASS009","DIP001","DIP011"],
    preferredRegions: ["Nakuru"],
    secondaryRegions: ["Eldoret"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 5
},

{
    name: "Rev. Michael Waweru",
    phone: "0700000017",
    email: "michael.waweru@npbc.co.ke",
    courseCodes: ["CERT011","ASS003","ASS005","DIP003","DIP006"],
    preferredRegions: ["Kiambu"],
    secondaryRegions: ["Nairobi"],
    availability: [2,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. George Muriithi",
    phone: "0700000018",
    email: "george.muriithi@npbc.co.ke",
    courseCodes: ["CERT004","ASS004","ASS007","DIP005","DIP009"],
    preferredRegions: ["Nyeri"],
    secondaryRegions: ["Meru"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 4
},

{
    name: "Rev. Francis Njuguna",
    phone: "0700000019",
    email: "francis.njuguna@npbc.co.ke",
    courseCodes: ["CERT005","ASS008","ASS010","DIP004","DIP008"],
    preferredRegions: ["Nairobi"],
    secondaryRegions: ["Kiambu"],
    availability: [1,3,4],
    maxAssignmentsPerMonth: 5
},

{
    name: "Rev. Eliud Kibet",
    phone: "0700000020",
    email: "eliud.kibet@npbc.co.ke",
    courseCodes: ["CERT006","ASS009","ASS011","DIP002","DIP007"],
    preferredRegions: ["Eldoret"],
    secondaryRegions: ["Nakuru"],
    availability: [1,2,3,4],
    maxAssignmentsPerMonth: 4
}

];

const importData = async () => {

    try {

        await connectDB();

        await Lecturer.deleteMany();

        const lecturers = [];

        for (const lecturer of lecturerData) {

            const courseIds =
                await getCourseIds(lecturer.courseCodes);

            lecturers.push({

                name: lecturer.name,

                phone: lecturer.phone,

                email: lecturer.email,

                courses: courseIds,

                preferredRegions:
                    lecturer.preferredRegions,

                secondaryRegions:
                    lecturer.secondaryRegions,

                availability:
                    lecturer.availability,

                active: true,

                maxAssignmentsPerMonth:
                    lecturer.maxAssignmentsPerMonth,

                currentAssignments: 0

            });

        }

        const inserted =
            await Lecturer.insertMany(lecturers);

        console.log(
            `${inserted.length} lecturers seeded successfully.`
        );

        process.exit();

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

};

importData();