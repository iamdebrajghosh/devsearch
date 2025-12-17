const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  parsedText: { type: String, default: "" },
  extractedSkills: { type: [String], default: [] },
});

const Resume = mongoose.model("Resume", resumeSchema);
module.exports = Resume;

