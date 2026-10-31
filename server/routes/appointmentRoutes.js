
const express = require("express");

const {
    bookAppointmentController,
    getMyAppointmentsController,
    cancelAppointmentController,
    getFacultyAppointmentsController,
    updateAppointmentStatusController
} = require("../controllers/appointmentController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only logged-in students can book appointments
router.post(
    "/book",
    protect,
    authorize("student"),
    bookAppointmentController
);

router.get(
    "/my-appointments",
    protect,
    authorize("student"),
    getMyAppointmentsController
);

router.put(
    "/cancel/:id",
    protect,
    authorize("student"),
    cancelAppointmentController
);

router.get(
    "/faculty-appointments",
    protect,
    authorize("faculty"),
    getFacultyAppointmentsController
);

router.patch(
    "/update-status/:id",
    protect,
    authorize("faculty"),
    updateAppointmentStatusController
);

module.exports = router;
