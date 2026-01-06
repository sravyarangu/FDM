import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import HOD from "./models/hod.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const updateHODs = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Delete all existing HODs
        await HOD.deleteMany({});
        console.log("✅ Deleted old HOD records");

        // Create new HODs with updated names
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
            const hashedPassword = await bcrypt.hash(hodData.password, 10);
            await HOD.create({ ...hodData, password: hashedPassword });
            console.log(`✅ HOD created: ${hodData.name} (${hodData.username})`);
        }

        console.log("\n🎉 HOD database updated successfully!");
        console.log("\n📋 HOD Credentials (all passwords: Hod@123):");
        console.log("CSE: hod_cse - Dr. Aruna Kumari");
        console.log("ECE: hod_ece - Dr. TSN Murthy");
        console.log("EEE: hod_eee");
        console.log("MECH: hod_mech");
        console.log("CIVIL: hod_civil");
        console.log("MET: hod_met");
        console.log("MCA: hod_mca");
        console.log("MBA: hod_mba");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating HODs:", error);
        process.exit(1);
    }
};

updateHODs();
