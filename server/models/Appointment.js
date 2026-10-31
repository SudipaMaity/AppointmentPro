
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        time: {
            type: String,
            required: true
        },

        reason: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["confirmed", "cancelled", "completed"],
            default: "confirmed"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
