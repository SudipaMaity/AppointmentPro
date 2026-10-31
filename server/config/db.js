
const mongoose = require("mongoose");
const dns = require("dns");

// Use reliable DNS servers
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("Connected to Database Successfully!");
    } catch (err) {
        console.log("Database Connection Failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;
