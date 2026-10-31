
const express = require("express");

const {
    getFacultyController
} = require("../controllers/facultyController");

const router = express.Router();

// Get all faculty members
router.get("/all", getFacultyController);

module.exports = router;
