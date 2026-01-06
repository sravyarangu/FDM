import mongoose from 'mongoose';
import Student from './models/student.js';
import dotenv from 'dotenv';

dotenv.config();

const testUpload = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/feedback_system';
    await mongoose.connect(mongoURI);
    console.log('✓ Connected to MongoDB');

    // Create test student data (matching your Excel data)
    const testStudent = {
      rollNo: '24VV1A0552',
      name: 'Test Student',
      dob: '2007-01-10', // YYYY-MM-DD format
      email: 'test@example.com',
      branch: 'CSE',
      program: 'BTech',
      admittedYear: 2024,
      currentYear: 1,
      semester: 1,
      regulation: 'R22',
      isActive: true
    };

    console.log('\nCreating test student:', testStudent);

    // Check if student exists
    const existing = await Student.findOne({ rollNo: testStudent.rollNo });
    
    if (existing) {
      console.log('Student already exists, updating...');
      Object.assign(existing, testStudent);
      await existing.save();
      console.log('✓ Student updated successfully');
    } else {
      const student = new Student(testStudent);
      await student.save();
      console.log('✓ Student created successfully');
    }

    // Verify the student was saved
    const saved = await Student.findOne({ rollNo: testStudent.rollNo });
    console.log('\nSaved student data:');
    console.log('Roll Number:', saved.rollNo);
    console.log('Name:', saved.name);
    console.log('DOB:', saved.dob);
    console.log('Email:', saved.email);
    console.log('Branch:', saved.branch);

    // Test login
    console.log('\n--- Testing Login ---');
    const loginTests = [
      '10-01-2007',  // DD-MM-YYYY (what user enters)
      '2007-01-10',  // YYYY-MM-DD (what's stored)
      '10/01/2007',  // DD/MM/YYYY
    ];

    const normalizeDOB = (dateStr) => {
      if (!dateStr) return '';
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      
      const parts = dateStr.split(/[-\/]/);
      if (parts.length === 3) {
        const [part1, part2, part3] = parts;
        if (part1.length === 4) {
          return `${part1}-${part2.padStart(2, '0')}-${part3.padStart(2, '0')}`;
        }
        return `${part3}-${part2.padStart(2, '0')}-${part1.padStart(2, '0')}`;
      }
      return dateStr;
    };

    for (const testDOB of loginTests) {
      const normalized = normalizeDOB(testDOB);
      const match = normalized === saved.dob;
      console.log(`  Input: ${testDOB} → ${normalized} → ${match ? '✓ MATCH' : '✗ NO MATCH'}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✓ Database connection closed');
  }
};

testUpload();
