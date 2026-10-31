
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new student
const registerController = async (req, res) => {
    try {
        const { name, email, password, department } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            department,
            role: "student"
        });


        console.log("Registration Successfull");
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Registration Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }

};

// Login Controller

// Student Login
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter email and password"
            });
        }

        // Find user by email
        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register first."
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        console.log("Login Successfull");
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.log("Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// Fetch Profile

const getProfileController = async (req, res) => {
    try {

        console.log("fetched login user successfully", req.user);
        return res.status(200).json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch profile"
        });
    }
};



module.exports = { registerController, loginController, getProfileController };
