import mongoose from "mongoose";
import dotenv from "dotenv";
import Student from "./models/student.js";

dotenv.config();

const fixAllStudentsDOB = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB\n");

        // Get ALL students
        const students = await Student.find({});
        console.log(`📊 Found ${students.length} students in database\n`);

        let updatedCount = 0;
        let skippedCount = 0;
        let errorCount = 0;

        for (const student of students) {
            try {
                let newDOB = student.dob;
                let needsUpdate = false;

                // Check if DOB is a number (Excel serial)
                if (typeof student.dob === 'number' || !isNaN(student.dob)) {
                    const excelSerial = Number(student.dob);
                    const excelEpoch = new Date(1899, 11, 30);
                    const jsDate = new Date(excelEpoch.getTime() + (excelSerial * 86400000));
                    const year = jsDate.getFullYear();
                    const month = String(jsDate.getMonth() + 1).padStart(2, '0');
                    const day = String(jsDate.getDate()).padStart(2, '0');
                    newDOB = `${day}-${month}-${year}`;
                    needsUpdate = true;
                    console.log(`🔧 ${student.rollNo}: Converting Excel serial ${excelSerial} → ${newDOB}`);
                }
                // Check if DOB is in YYYY-MM-DD format
                else if (typeof student.dob === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(student.dob)) {
                    const [year, month, day] = student.dob.split('-');
                    newDOB = `${day}-${month}-${year}`;
                    needsUpdate = true;
                    console.log(`🔧 ${student.rollNo}: Converting YYYY-MM-DD ${student.dob} → ${newDOB}`);
                }
                // Check if already in DD-MM-YYYY format
                else if (typeof student.dob === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(student.dob)) {
                    skippedCount++;
                    console.log(`✓ ${student.rollNo}: Already in DD-MM-YYYY format (${student.dob})`);
                    continue;
                }
                else {
                    console.log(`⚠️  ${student.rollNo}: Unknown DOB format (${student.dob}) - skipping`);
                    errorCount++;
                    continue;
                }

                if (needsUpdate) {
                    student.dob = newDOB;
                    await student.save();
                    updatedCount++;
                }
            } catch (error) {
                console.error(`❌ Error updating ${student.rollNo}:`, error.message);
                errorCount++;
            }
        }

        console.log("\n" + "=".repeat(50));
        console.log("📊 SUMMARY");
        console.log("=".repeat(50));
        console.log(`Total Students: ${students.length}`);
        console.log(`✅ Updated: ${updatedCount}`);
        console.log(`✓ Already Correct: ${skippedCount}`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log("=".repeat(50) + "\n");

        await mongoose.connection.close();
        console.log("✅ Database connection closed");
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

fixAllStudentsDOB();
