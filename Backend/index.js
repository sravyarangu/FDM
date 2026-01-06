import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import database configuration
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import studentRoutes from "./routes/student.js";
import hodRoutes from "./routes/hod.js";
import adminRoutes from "./routes/admin.js";
import principalRoutes from "./routes/principal.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
await connectDB();

// Routes
app.get("/", (req, res) => {
    res.json({ 
        message: "Feedback Management System API",
        version: "1.0.0",
        status: "running"
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/principal', principalRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Route not found' 
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});