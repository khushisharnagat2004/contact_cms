require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/authRoutes");

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Configure CORS properly
// const corsOptions = {
//     origin: [
//         "http://localhost:5173",
//         "https://contact-app-frontend-7bz18i9cb-shashank-morekars-projects.vercel.app"
//     ],
//     methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
// };

// ✅ Apply Middleware
app.use(cors());  // Enable CORS with specific settings
app.use(express.json()); // Parse JSON request bodies

const PORT = process.env.PORT || 4000;

// ✅ Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`📢 [${req.method}] ${req.path}`);
    next();
});

// ✅ API Routes
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

// ✅ Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
