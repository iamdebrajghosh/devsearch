const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");
const { extractTextFromResume } = require("../utils/resumeParser");

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const { filename, path: filepath, mimetype } = req.file;
    const userId = req.user.userId;

    const existing = await Resume.findOne({ userId });
    if (existing) {
      if (existing.filePath && fs.existsSync(existing.filePath)) {
        try {
          fs.unlinkSync(existing.filePath);
        } catch {}
      }
      existing.fileName = filename;
      existing.filePath = filepath;
      existing.fileType = mimetype;
      existing.uploadedAt = new Date();
      existing.parsedText = "";
      existing.extractedSkills = Array.isArray(existing.extractedSkills) ? existing.extractedSkills : [];
      const parsedText = await extractTextFromResume(filepath, mimetype);
      existing.parsedText = parsedText;
      await existing.save();
    } else {
      const parsedText = await extractTextFromResume(filepath, mimetype);
      await Resume.create({
        userId,
        fileName: filename,
        filePath: filepath,
        fileType: mimetype,
        parsedText,
      });
    }

    const fileUrl = `/uploads/resumes/${filename}`;
    return res.status(201).json({
      message: "Resume uploaded",
      fileName: filename,
      fileType: mimetype,
      fileUrl,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.user.userId }).select(
      "fileName fileType uploadedAt parsedText"
    );
    if (!resume) {
      return res.status(404).json({ message: "Not found" });
    }
    const preview = (resume.parsedText || "").slice(0, 1000).trim();
    return res.json({
      fileName: resume.fileName,
      fileType: resume.fileType,
      uploadedAt: resume.uploadedAt,
      parsedText: preview,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
