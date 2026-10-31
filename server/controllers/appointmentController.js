
const Appointment = require("../models/Appointment");
const User = require("../models/User");

// Book an appointment
const bookAppointmentController = async (req, res) => {
    try {
        const { facultyId, date, time, reason } = req.body;

        // Validate required fields
        if (!facultyId || !date || !time || !reason) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        // Check faculty
        const faculty = await User.findOne({
            _id: facultyId,
            role: "faculty"
        });

        if (!faculty) {
            return res.status(404).json({
                success: false,
                message: "Faculty member not found"
            });
        }

        // Validate appointment date
        const appointmentDate = new Date(date);

        if (isNaN(appointmentDate.getTime()) || appointmentDate <= new Date()) {
            return res.status(400).json({
                success: false,
                message: "Please select a future appointment date"
            });
        }

        // Create appointment
        const appointment = await Appointment.create({
            student: req.user._id,
            faculty: facultyId,
            date: appointmentDate,
            time,
            reason,
            status: "confirmed"
        });

        return res.status(201).json({
            success: true,
            message: "Appointment booked successfully!",
            appointment
        });

    } catch (error) {
        console.log("Booking Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to book appointment"
        });
    }
};


// Get appointments booked by logged-in student
const getMyAppointmentsController = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            student: req.user._id
        })
            .populate("faculty", "name email department designation")
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments
        });

    } catch (error) {
        console.log("Fetch Appointments Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch appointments"
        });
    }
};

// Cancel booked appointment
const cancelAppointmentController = async (req, res) => {
    try {
        const { id } = req.params;

        const appointment = await Appointment.findOne({
            _id: id,
            student: req.user._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                message: "Appointment cannot be cancelled"
            });
        }

        appointment.status = "cancelled";

        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully",
            appointment
        });

    } catch (error) {
        console.log("Cancellation Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel appointment"
        });
    }
};

// Get appointments booked for faculty
const getFacultyAppointmentsController = async (req, res) => {
    try {
        const appointments = await Appointment.find({
            faculty: req.user._id
        })
            .populate("student", "name email department")
            .sort({ date: 1 });

        return res.status(200).json({
            success: true,
            total: appointments.length,
            appointments
        });

    } catch (error) {
        console.log("Faculty Appointments Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch faculty appointments"
        });
    }
};

// Update appointment status

const updateAppointmentStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment status"
            });
        }

        // Find appointment belonging to logged-in faculty
        const appointment = await Appointment.findOne({
            _id: id,
            faculty: req.user._id
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                message: "Only confirmed appointments can be completed"
            });
        }

        appointment.status = status;
        await appointment.save();

        return res.status(200).json({
            success: true,
            message: "Appointment marked as completed",
            appointment
        });

    } catch (error) {
        console.log("Status Update Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update appointment status"
        });
    }
};





module.exports = { bookAppointmentController, getMyAppointmentsController, cancelAppointmentController, getFacultyAppointmentsController, updateAppointmentStatusController };
