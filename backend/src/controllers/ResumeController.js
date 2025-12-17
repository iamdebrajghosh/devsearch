const path = require("path");
const fs = require("fs");
const Resume = require("../models/Resume");

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
      existing.parsedText = existing.parsedText || "";
      existing.extractedSkills = Array.isArray(existing.extractedSkills) ? existing.extractedSkills : [];
      await existing.save();
    } else {
      await Resume.create({
        userId,
        fileName: filename,
        filePath: filepath,
        fileType: mimetype,
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

