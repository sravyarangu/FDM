import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({

    subjectName :String,
    facultyName : String,
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" },
  critera : String ,
  totalResponses: { type: Number, default: 0 },  
  overallRating: { type: Number, default: 0 }  
});

module.export = mongoose.model("analytics",analyticsSchema);
