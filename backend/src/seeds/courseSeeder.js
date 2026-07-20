import mongoose from "mongoose";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import Course from "../models/Course.js";

dotenv.config();

const courses = [
  // CERTIFICATE

  {
    name: "Principles of Study",
    code: "CERT001",
    level: "CERTIFICATE",
  },
  {
    name: "Introduction to the Old Testament",
    code: "CERT002",
    level: "CERTIFICATE",
  },
  {
    name: "Soteriology",
    code: "CERT003",
    level: "CERTIFICATE",
  },
  {
    name: "God and Angels",
    code: "CERT004",
    level: "CERTIFICATE",
  },
  {
    name: "Christian Counseling",
    code: "CERT005",
    level: "CERTIFICATE",
  },
  {
    name: "Genesis",
    code: "CERT006",
    level: "CERTIFICATE",
  },
  {
    name: "Introduction to the New Testament",
    code: "CERT007",
    level: "CERTIFICATE",
  },
  {
    name: "Hermeneutics",
    code: "CERT008",
    level: "CERTIFICATE",
  },
  {
    name: "Evangelism and Discipleship",
    code: "CERT009",
    level: "CERTIFICATE",
  },
  {
    name: "Romans & Galatians",
    code: "CERT010",
    level: "CERTIFICATE",
  },
  {
    name: "Homiletics",
    code: "CERT011",
    level: "CERTIFICATE",
  },
  {
    name: "Eschatology",
    code: "CERT012",
    level: "CERTIFICATE",
  },

  // ASSOCIATE

  {
    name: "Ministry to Children",
    code: "ASS001",
    level: "ASSOCIATE",
  },
  {
    name: "Christian Ethics",
    code: "ASS002",
    level: "ASSOCIATE",
  },
  {
    name: "Communication Skills",
    code: "ASS003",
    level: "ASSOCIATE",
  },
  {
    name: "Christology",
    code: "ASS004",
    level: "ASSOCIATE",
  },
  {
    name: "Missiology",
    code: "ASS005",
    level: "ASSOCIATE",
  },
  {
    name: "Church History 1",
    code: "ASS006",
    level: "ASSOCIATE",
  },
  {
    name: "Bibliology",
    code: "ASS007",
    level: "ASSOCIATE",
  },
  {
    name: "Anthropology and Hamartiology",
    code: "ASS008",
    level: "ASSOCIATE",
  },
  {
    name: "Ecclesiology",
    code: "ASS009",
    level: "ASSOCIATE",
  },
  {
    name: "Pastoral Care and Ministry",
    code: "ASS010",
    level: "ASSOCIATE",
  },
  {
    name: "Comparative Religions",
    code: "ASS011",
    level: "ASSOCIATE",
  },
  {
    name: "Church History 2",
    code: "ASS012",
    level: "ASSOCIATE",
  },

  // DIPLOMA

  {
    name: "Acts",
    code: "DIP001",
    level: "DIPLOMA",
  },
  {
    name: "Christian Marriage & Family",
    code: "DIP002",
    level: "DIPLOMA",
  },
  {
    name: "Church Leadership, Management & Governance",
    code: "DIP003",
    level: "DIPLOMA",
  },
  {
    name: "Principles of Research Methods",
    code: "DIP004",
    level: "DIPLOMA",
  },
  {
    name: "Pneumatology",
    code: "DIP005",
    level: "DIPLOMA",
  },
  {
    name: "Writing Better English",
    code: "DIP006",
    level: "DIPLOMA",
  },
  {
    name: "Corinthians",
    code: "DIP007",
    level: "DIPLOMA",
  },
  {
    name: "Church Ceremonies and Ordinances",
    code: "DIP008",
    level: "DIPLOMA",
  },
  {
    name: "Wisdom Literature",
    code: "DIP009",
    level: "DIPLOMA",
  },
  {
    name: "Principles of Teaching",
    code: "DIP010",
    level: "DIPLOMA",
  },
  {
    name: "New Religious Movements",
    code: "DIP011",
    level: "DIPLOMA",
  },
  {
    name: "Pentecostalism",
    code: "DIP012",
    level: "DIPLOMA",
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Course.deleteMany();

    const insertedCourses = await Course.insertMany(courses);

    console.log(`${insertedCourses.length} courses seeded successfully.`);

    process.exit();
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

importData();
