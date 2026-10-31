
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

const createFaculty = async () => {
    try {
        await connectDB();

        const email = "faculty@gmail.com";

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log("Faculty account already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash("faculty123", 10);

        await User.create({
            name: "Dr. Priya Sharma",
            email,
            password: hashedPassword,
            role: "faculty",
            department: "Computer Science",
            designation: "Assistant Professor"
        });

        console.log("Faculty account created successfully!");

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createFaculty();
