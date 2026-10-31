
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verify user token
const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

// Check user role
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this resource"
            });
        }

        next();
    };
};

module.exports = { protect, authorize };
