import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "ictservices@npbc.co.ke";
    const password = "ChangeMe123!";
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Admin user already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await User.create({
      name: "George",
      email,
      password: hashedPassword,
      role: "ADMIN",
      active: true,
    });

    console.log("Admin created successfully.");
    console.log("Email:", admin.email);
    console.log("Password:", password);

    process.exit(0);
  } catch (error) {
    console.error("ERROR CREATING ADMIN:", error);
    process.exit(1);
  }
};

createAdmin();