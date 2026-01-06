import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/admin.js";
import Program from "./models/program.js";
import HOD from "./models/hod.js";
import Principal from "./models/principal.js";
import VicePrincipal from "./models/vicePrincipal.js";
import Student from "./models/student.js";
import FeedbackQuestion from "./models/feedbackQuestion.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Create default admin
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await Admin.create({
                username: 'admin',
                password: hashedPassword,
                name: 'System Administrator',
                email: 'admin@jntugv.edu.in',
                role: 'admin'
            });
            console.log("✅ Admin created (username: admin, password: Admin@123)");
        }

        // Create Principal
        const principalExists = await Principal.findOne({ username: 'principal' });
        if (!principalExists) {
            const hashedPassword = await bcrypt.hash('Principal@123', 10);
            await Principal.create({
                username: 'principal',
                password: hashedPassword,
                name: 'Dr. Principal JNTUGV',
                email: 'principal@jntugv.edu.in',
                phone: '9876543210',
                employeeId: 'PRIN001',
                role: 'principal'
            });
            console.log("✅ Principal created (email: principal@jntugv.edu.in, password: Principal@123)");
        }

        // Create Vice Principal
        const vpExists = await VicePrincipal.findOne({ username: 'viceprincipal' });
        if (!vpExists) {
            const hashedPassword = await bcrypt.hash('VicePrincipal@123', 10);
            await VicePrincipal.create({
                username: 'viceprincipal',
                password: hashedPassword,
                name: 'Dr. Vice Principal JNTUGV',
                email: 'viceprincipal@jntugv.edu.in',
                phone: '9876543211',
                employeeId: 'VP001',
                role: 'vice_principal'
            });
            console.log("✅ Vice Principal created (email: viceprincipal@jntugv.edu.in, password: VicePrincipal@123)");
        }

        // Create programs
        const programs = [
            { name: 'BTech', code: 'BTECH', duration: 4, branches: ['CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'] },
            { name: 'MTech', code: 'MTECH', duration: 2, branches: ['CSE', 'VLSI', 'POWER SYSTEMS'] },
            { name: 'MCA', code: 'MCA', duration: 2, branches: [] },
            { name: 'MBA', code: 'MBA', duration: 2, branches: [] }
        ];

        for (const prog of programs) {
            const exists = await Program.findOne({ code: prog.code });
            if (!exists) {
                await Program.create(prog);
                console.log(`✅ Program created: ${prog.name}`);
            }
        }

        // Create sample HODs
        const hods = [
            { username: 'hod_cse', password: 'Hod@123', name: 'Dr. Aruna Kumari', email: 'hod.cse@jntugv.edu.in', branch: 'CSE', program: 'BTech' },
            { username: 'hod_ece', password: 'Hod@123', name: 'Dr. TSN Murthy', email: 'hod.ece@jntugv.edu.in', branch: 'ECE', program: 'BTech' },
            { username: 'hod_eee', password: 'Hod@123', name: 'Dr. EEE HOD', email: 'hod.eee@jntugv.edu.in', branch: 'EEE', program: 'BTech' },
            { username: 'hod_mech', password: 'Hod@123', name: 'Dr. Mech HOD', email: 'hod.mech@jntugv.edu.in', branch: 'MECH', program: 'BTech' },
            { username: 'hod_civil', password: 'Hod@123', name: 'Dr. Civil HOD', email: 'hod.civil@jntugv.edu.in', branch: 'CIVIL', program: 'BTech' },
            { username: 'hod_met', password: 'Hod@123', name: 'Dr. MET HOD', email: 'hod.met@jntugv.edu.in', branch: 'MET', program: 'BTech' },
            
            { username: 'hod_mca', password: 'Hod@123', name: 'Dr. MCA Director', email: 'hod.mca@jntugv.edu.in', branch: 'MCA', program: 'MCA' },
            { username: 'hod_mba', password: 'Hod@123', name: 'Dr. MBA Director', email: 'hod.mba@jntugv.edu.in', branch: 'MBA', program: 'MBA' }
        ];

        for (const hodData of hods) {
            const exists = await HOD.findOne({ username: hodData.username });
            if (!exists) {
                const hashedPassword = await bcrypt.hash(hodData.password, 10);
                await HOD.create({ ...hodData, password: hashedPassword });
                console.log(`✅ HOD created: ${hodData.username} (password: Hod@123)`);
            }
        }

        // Create sample students for testing
   

        for (const studentData of sampleStudents) {
            const exists = await Student.findOne({ rollNo: studentData.rollNo });
            if (!exists) {
                await Student.create(studentData);
                console.log(`✅ Student created: ${studentData.rollNo} (DOB: ${studentData.dob})`);
            }
        }

        // Create default feedback questions
        const questionsExist = await FeedbackQuestion.countDocuments();
        if (questionsExist === 0) {
            const questions = [
                { sno: 1, criteria: "Teacher is prepared for the class and good at blackboard management"},
            { sno: 2, criteria: "Teacher knows his/her subject . His lecture is audible and expressed with clarity" },
            { sno: 3, criteria: "Teacher is organised and neat . Teacher has clear classroom proceedures so students donn't waste time" },
            { sno: 4, criteria: " Teacher is punctual to the class, plans class time and help students to solve problems and think critically.Teacher provides activities that make subject matter meaningful." },
            { sno: 5, criteria: "Teacher is flexible in accommodating for individual student needs." },
            { sno: 6, criteria: "Teacher is clear in giving directions and on explaining what is expected on tests. He has clear idea in setting question paper." },
            { sno: 7, criteria: "Teacher allows you to be active in the classroom learning environment." },
            { sno: 8, criteria: "Teacher manages the time well and covers the syliabus."},
            { sno: 9, criteria: "Teacher awards marks fairly. Teacher conducts exam'nation as per schedule."},
            { sno: 10, criteria: "I have learned a lot about this subject and the teacher motivates the students in global aspects besides teaching."},
            { sno: 11, criteria: "Teacher gives me good feedback so that I can improve."},
            { sno: 12, criteria: "Teacher uses advanced teaching aids. Teacher is creative in developing activities and lessons."},
            { sno: 13, criteria: "Teacher encourages students to speak up and be active in the class."},
            { sno: 14, criteria: "Teacher follows through on what he/she says. You can count on the teacher's word."},
            { sno: 15, criteria: "Teacher listens and understands students' point of view. Teacher respects the opinions and decisions of students."},
            { sno: 16, criteria: "Teacher adjusts class work when on leave or compensates missed classes. Teacher is willing to accept responsibility for his/lier own mistakes."},
            { sno: 17, criteria: "Teacher is consistent, fair and firm in discipline without being too strict."},
            { sno: 18, criteria: "Teacher is sensitive to the needs of students. Teacher likes and respects students."},
            { sno: 19, criteria: "Teacher helps you when you ask for help."},
            { sno: 20, criteria: "Teacher's words and actions match. I trust this teacher."}
            ];
            await FeedbackQuestion.insertMany(questions);
            console.log("✅ Feedback questions created");
        }

        console.log("\n🎉 Database seeding completed!");
        console.log("\n📋 Default Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("ADMIN (Super Admin):");
        console.log("  Email: admin@jntugv.edu.in");
        console.log("  Password: Admin@123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("PRINCIPAL:");
        console.log("  Email: principal@jntugv.edu.in");
        console.log("  Password: Principal@123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("VICE PRINCIPAL:");
        console.log("  Email: viceprincipal@jntugv.edu.in");
        console.log("  Password: VicePrincipal@123");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("HODs (Password: Hod@123 for all):");
        console.log("  CSE: hod.cse@jntugv.edu.in");
        console.log("  ECE: hod.ece@jntugv.edu.in");
        console.log("  MCA: hod.mca@jntugv.edu.in");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("STUDENTS (Login with Roll Number + DOB):");
        console.log("  Roll: 23VV1A0546, DOB: 2005-01-10");
        console.log("  Roll: 23VV1A0501, DOB: 2005-05-15");
        console.log("  Roll: 22VV1A0401, DOB: 2004-03-25");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
