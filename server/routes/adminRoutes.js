const express = require("express");
const {
    getAdminStatsController,
    getAllAppointmentsController,
    createFacultyController
} = require("../controllers/adminController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

// Get Admin Dashboard Statistics
router.get(
    "/stats",
    protect,
    authorize("admin"),
    getAdminStatsController
);

// Get All Appointments (Admin Only)
router.get(
    "/all-appointments",
    protect,
    authorize("admin"),
    getAllAppointmentsController
);

// Register Faculty (Admin Only)
router.post(
    "/create-faculty",
    protect,
    authorize("admin"),
    createFacultyController
);

module.exports = router;