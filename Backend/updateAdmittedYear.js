import mongoose from 'mongoose';
import Student from './models/student.js';
import dotenv from 'dotenv';

dotenv.config();

const updateAdmittedYear = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all students
    const students = await Student.find({});
    console.log(`Found ${students.length} students`);

    let updated = 0;
    let skipped = 0;

    for (const student of students) {
      // If student has a batch field, use it to set admittedYear
      if (student.batch) {
        const batchYear = parseInt(student.batch);
        
        if (!isNaN(batchYear) && batchYear > 1900 && batchYear < 2100) {
          // Calculate currentYear and semester
          const currentCalendarYear = new Date().getFullYear();
          const yearsSinceAdmission = currentCalendarYear - batchYear;
          
          // Determine max years based on program
          const programYears = {
            'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
            'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
            'MBA': 2, 'MCA': 2
          };
          const maxYears = programYears[student.program] || 4;
          
          // If yearsSinceAdmission is 3, student is in year 3 (not year 4)
          const currentYear = Math.max(1, Math.min(yearsSinceAdmission, maxYears));
          const currentSemester = (currentYear * 2) - 1; // First semester of current year
          
          student.admittedYear = batchYear;
          student.currentYear = currentYear;
          student.semester = currentSemester;
          
          await student.save();
          console.log(`✓ Updated ${student.rollNo}: admittedYear=${batchYear}, currentYear=${currentYear}, semester=${currentSemester}`);
          updated++;
        } else {
          console.log(`✗ Skipped ${student.rollNo}: Invalid batch value "${student.batch}"`);
          skipped++;
        }
      } else {
        // If no batch field, try to keep existing admittedYear or set to a default
        if (!student.admittedYear) {
          // Extract year from roll number if possible (e.g., 23VV1A0552 -> 2023)
          const rollMatch = student.rollNo.match(/^(\d{2})/);
          if (rollMatch) {
            const yearSuffix = parseInt(rollMatch[1]);
            const admittedYear = yearSuffix >= 90 ? 1900 + yearSuffix : 2000 + yearSuffix;
            
            const currentCalendarYear = new Date().getFullYear();
            const yearsSinceAdmission = currentCalendarYear - admittedYear;
            
            const programYears = {
              'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
              'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
              'MBA': 2, 'MCA': 2
            };
            const maxYears = programYears[student.program] || 4;
            
            const currentYear = Math.max(1, Math.min(yearsSinceAdmission, maxYears));
            const currentSemester = (currentYear * 2) - 1;
            
            student.admittedYear = admittedYear;
            student.currentYear = currentYear;
            student.semester = currentSemester;
            
            await student.save();
            console.log(`✓ Updated ${student.rollNo} from roll number: admittedYear=${admittedYear}, currentYear=${currentYear}, semester=${currentSemester}`);
            updated++;
          } else {
            console.log(`⚠ Skipped ${student.rollNo}: No batch field and couldn't extract from roll number`);
            skipped++;
          }
        } else {
          // Recalculate currentYear and semester based on existing admittedYear
          const currentCalendarYear = new Date().getFullYear();
          const yearsSinceAdmission = currentCalendarYear - student.admittedYear;
          
          const programYears = {
            'BTECH': 4, 'BTech': 4, 'B.Tech': 4,
            'MTECH': 2, 'MTech': 2, 'M.Tech': 2,
            'MBA': 2, 'MCA': 2
          };
          const maxYears = programYears[student.program] || 4;
          
          const currentYear = Math.max(1, Math.min(yearsSinceAdmission, maxYears));
          const currentSemester = (currentYear * 2) - 1;
          
          student.currentYear = currentYear;
          student.semester = currentSemester;
          
          await student.save();
          console.log(`✓ Recalculated ${student.rollNo}: currentYear=${currentYear}, semester=${currentSemester}`);
          updated++;
        }
      }
    }

    console.log(`\n✅ Migration complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${students.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

updateAdmittedYear();
