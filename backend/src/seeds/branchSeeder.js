import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Branch from "../models/Branch.js";

dotenv.config();

const branches = [
  {
    name: "W.W Githurai",
    region: "Nairobi",
    week: 1,
    levels: ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"],
    active: true,
  },
  {
    name: "Garden Estate",
    region: "Nairobi",
    week: 1,
    levels: ["CERTIFICATE", "ASSOCIATE"],
    active: true,
  },
  {
    name: "Nakuru Town",
    region: "Nakuru",
    week: 2,
    levels: ["CERTIFICATE", "DIPLOMA"],
    active: true,
  },
  {
    name: "Kisumu",
    region: "Kisumu",
    week: 2,
    levels: ["CERTIFICATE"],
    active: true,
  },
  {
    name: "Nyeri",
    region: "Nyeri",
    week: 3,
    levels: ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"],
    active: true,
  },
  {
    name: "Embu",
    region: "Embu",
    week: 3,
    levels: ["ASSOCIATE"],
    active: true,
  },
  {
    name: "Meru",
    region: "Meru",
    week: 4,
    levels: ["CERTIFICATE", "DIPLOMA"],
    active: true,
  },
  {
    name: "Machakos",
    region: "Machakos",
    week: 4,
    levels: ["CERTIFICATE", "ASSOCIATE"],
    active: true,
  },
  {
    name: "Eldoret",
    region: "Uasin Gishu",
    week: 1,
    levels: ["DIPLOMA"],
    active: true,
  },
  {
    name: "Mombasa",
    region: "Mombasa",
    week: 2,
    levels: ["CERTIFICATE", "ASSOCIATE", "DIPLOMA"],
    active: true,
  },
];

const importData = async () => {
  try {
    await connectDB();

    await Branch.deleteMany();

    const inserted = await Branch.insertMany(branches);

    console.log(`${inserted.length} branches seeded successfully.`);

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();