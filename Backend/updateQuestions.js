import mongoose from "mongoose";
import dotenv from "dotenv";
import FeedbackQuestion from "./models/feedbackQuestion.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const updateQuestions = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        // Delete all existing questions
        await FeedbackQuestion.deleteMany({});
        console.log("✅ Deleted old feedback questions");

        // Insert new questions from index.js
        const newQuestions = [
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

        await FeedbackQuestion.insertMany(newQuestions);
        console.log("✅ New feedback questions created");
        console.log(`✅ Total questions: ${newQuestions.length}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error updating questions:", error);
        process.exit(1);
    }
};

updateQuestions();
