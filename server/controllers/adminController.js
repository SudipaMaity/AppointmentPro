
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Get Admin Dashboard Statistics
const getAdminStatsController = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalFaculty = await User.countDocuments({
            role: "faculty"
        });

        const totalAppointments = await Appointment.countDocuments();

        const confirmedAppointments = await Appointment.countDocuments({
            status: "confirmed"
        });

        const completedAppointments = await Appointment.countDocuments({
            status: "completed"
        });

        const cancelledAppointments = await Appointment.countDocuments({
            status: "cancelled"
        });

        return res.status(200).json({
            success: true,
            message: "Admin dashboard data fetched successfully",
            stats: {
                totalStudents,
                totalFaculty,
                totalAppointments,
                confirmedAppointments,
                completedAppointments,
                cancelledAppointments
            }
        });

    } catch (error) {
        console.log("Admin Dashboard Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch admin dashboard data"
        });
    }
};

// Get All Appointments
const getAllAppointmentsController = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate("student", "name email department")
            .populate("faculty", "name email department designation")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All appointments fetched successfully",
            totalAppointments: appointments.length,
            appointments
        });

    } catch (error) {
        console.log("All Appointments Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch appointments"
        });
    }
};

// Register Faculty (Admin Only)
const createFacultyController = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            department,
            designation
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !department || !designation) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create faculty account
        const faculty = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            department: department.trim(),
            designation: designation.trim(),
            role: "faculty"
        });
        console.log("Faculty Registered Successfully", faculty)
        return res.status(201).json({
            success: true,
            message: "Faculty registered successfully",
            faculty: {
                id: faculty._id,
                name: faculty.name,
                email: faculty.email,
                department: faculty.department,
                designation: faculty.designation,
                role: faculty.role
            }
        });

    } catch (error) {
        console.log("Faculty Registration Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to register faculty"
        });
    }
};

module.exports = { getAdminStatsController, getAllAppointmentsController, createFacultyController };
