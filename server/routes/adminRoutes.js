const express = require("express");
const {
    getAdminStatsController,
    getAllAppointmentsController
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

module.exports = router;