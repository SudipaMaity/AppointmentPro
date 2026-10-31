
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

module.exports = { getAdminStatsController, getAllAppointmentsController };
