require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

const createAdmin = async () => {
    try {
        await connectDB();

        const email = "admin@gmail.com";

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists!");
            return;
        }

        const hashedPassword = await bcrypt.hash("Admin@12345", 10);

        await User.create({
            name: "System Admin",
            email,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin account created successfully!");

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

createAdmin();