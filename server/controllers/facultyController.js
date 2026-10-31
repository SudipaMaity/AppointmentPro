
const User = require("../models/User");

// Get all faculty members
const getFacultyController = async (req, res) => {
    try {
        const faculty = await User.find({ role: "faculty" })
            .select("name email department designation");

        return res.status(200).json({
            success: true,
            message: "Faculty list fetched successfully",
            total: faculty.length,
            faculty
        });

    } catch (error) {
        console.log("Faculty Fetch Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch faculty members"
        });
    }
};

module.exports = { getFacultyController };
