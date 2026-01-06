import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/student.js";

dotenv.config();

const checkStudentDOB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get all students to verify DOB format
        const students = await Student.find({}).select('rollNo name dob');

        console.log("📊 CURRENT DOB FORMAT FOR ALL STUDENTS");
        console.log("=".repeat(60));
        students.forEach(student => {
            console.log(`${student.rollNo} | ${student.name.padEnd(20)} | DOB: ${student.dob}`);
        });
        console.log("=".repeat(60) + "\n");

        await mongoose.connection.close();
        console.log("✅ Database connection closed");
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

checkStudentDOB();
