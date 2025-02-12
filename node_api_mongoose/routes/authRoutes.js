const express = require("express");
const { registerUser, loginUser, logoutUser, authenticateUser } = require("../controller/userController");
const { body } = require("express-validator");
const User = require("../model/User");

const router = express.Router();

// Register route
router.post(
    "/register",
    [
        body("name", "Name is required").not().isEmpty(),
        body("email", "Please include a valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    registerUser
);

// Login route
router.post(
    "/login",
    [
        body("email", "Please include a valid email").isEmail(),
        body("password", "Password is required").exists(),
    ],
    loginUser
);

// Logout route
router.post("/logout", logoutUser);

// Protected route to get user details
router.get("/me", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
