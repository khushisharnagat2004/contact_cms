const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const JWT_SECRET = "abc1234"; // Change this to a secure secret
const TOKEN_EXPIRY = "1h"; // Expiry time for the token

// Register a new user
const registerUser = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, message: "User registered successfully", data: user });
    } catch (error) {
        console.error("Error in registerUser:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// User login
const loginUser = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        // Set token in HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure in production
            maxAge: 3600000, // 1 hour
        });

        res.status(200).json({ success: true, message: "Login successful", token, userId: user.id });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// User logout
const logoutUser = (req, res) => {
    try {
        res.clearCookie("token"); // Clear JWT token from cookies
        res.status(200).json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Middleware to protect routes
const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.token;
    console.log(token);

    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = { registerUser, loginUser, logoutUser, authenticateUser };
