import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import Principal from '../models/principal.js';
import VicePrincipal from '../models/vicePrincipal.js';
import FeedbackQuestion from '../models/feedbackQuestion.js';

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://sravyaranguwork_db_user:jntugv@cluster0.cpotcnc.mongodb.net/StudentDB";
    
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
    
    // Initialize default admin if not exists
    await initializeAdmin();
    
    // Initialize default principal if not exists
    await initializePrincipal();
    
    // Initialize default vice principal if not exists
    await initializeVicePrincipal();
    
    // Initialize default feedback questions if not exists
    await initializeFeedbackQuestions();
    
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Initialize default admin
const initializeAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ 
      username: process.env.DEFAULT_ADMIN_USERNAME || 'admin' 
    });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123', 
        10
      );
      
      const admin = new Admin({
        username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
        password: hashedPassword,
        name: 'System Administrator',
        email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@jntugv.edu.in',
        role: 'admin'
      });
      
      await admin.save();
      console.log('✅ Default admin created');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

// Initialize default principal
const initializePrincipal = async () => {
  try {
    const principalExists = await Principal.findOne({ 
      username: process.env.DEFAULT_PRINCIPAL_USERNAME || 'principal' 
    });
    
    if (!principalExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_PRINCIPAL_PASSWORD || 'Principal@123', 
        10
      );
      
      const principal = new Principal({
        username: process.env.DEFAULT_PRINCIPAL_USERNAME || 'principal',
        password: hashedPassword,
        name: 'Principal',
        email: process.env.DEFAULT_PRINCIPAL_EMAIL || 'principal@jntugv.edu.in',
        role: 'principal'
      });
      
      await principal.save();
      console.log('✅ Default principal created');
    }
  } catch (error) {
    console.error('Error initializing principal:', error);
  }
};

// Initialize default vice principal
const initializeVicePrincipal = async () => {
  try {
    const vpExists = await VicePrincipal.findOne({ 
      username: process.env.DEFAULT_VP_USERNAME || 'vice_principal' 
    });
    
    if (!vpExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.DEFAULT_VP_PASSWORD || 'VicePrincipal@123', 
        10
      );
      
      const vicePrincipal = new VicePrincipal({
        username: process.env.DEFAULT_VP_USERNAME || 'vice_principal',
        password: hashedPassword,
        name: 'Vice Principal',
        email: process.env.DEFAULT_VP_EMAIL || 'vp@jntugv.edu.in',
        role: 'vice_principal'
      });
      
      await vicePrincipal.save();
      console.log('✅ Default vice principal created');
    }
  } catch (error) {
    console.error('Error initializing vice principal:', error);
  }
};

// Initialize default feedback questions
const initializeFeedbackQuestions = async () => {
  try {
    const questionsExist = await FeedbackQuestion.countDocuments();
    
    if (questionsExist === 0) {
      const defaultQuestions = [
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
        {sno : 11 , criteria :"Teacher gives me good feedback so that I can improve."},
        { sno :12 , criteria :"Teacher uses advanced teaching aids. Teacher is creative in developing activities and lessons."},
        {sno :13 , criteria :"Teacher encourages students to speak up and be active in the class."},
        {sno :14 , criteria :"Teacher follows through on what he/she says. You can count on the teacher's word."},
        {sno :15 , criteria :"Teacher listens and understands students' point of view. Teacher respects the opinions and decisions of students."},
        {sno :16,criteria :"Teacher adjusts class work when on leave or compensates missed classes. Teacher is willing to accept responsibility for his/lier own mistakes."},
        {sno :17 ,criteria :"Teacher is consistent, fair and firm in discipline without being too strict."},
        {sno :18 , criteria :"Teacher is sensitive to the needs of students. Teacher likes and respects students."},
        {sno : 19 ,criteria :"Teacher helps you when you ask for help."},
        {sno :20 , criteria :"Teacher's words and actions match. I trust this teacher."}
      ];
      
      await FeedbackQuestion.insertMany(defaultQuestions);
      console.log("✅ Default feedback questions created");
    }
  } catch (error) {
    console.error('Error initializing feedback questions:', error);
  }
};

export default connectDB;
