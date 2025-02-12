const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from header
    console.log(token);
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: "Invalid token" });
        }
        req.user = decoded; // Attach user info to request object
        console.log(decoded);
        next(); // Move to the next middleware or route
    });
};

module.exports = authenticateToken;
