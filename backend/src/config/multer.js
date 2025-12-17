const multer = require("multer");
const path = require("path");
const fs = require("fs");

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "resumes");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureDir(UPLOAD_DIR);
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.user?.userId || "unknown";
    const timestamp = Date.now();
    const original = path.basename(file.originalname).replace(/\s+/g, "_");
    cb(null, `${userId}_${timestamp}_${original}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedExt = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedMime = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (!allowedExt.includes(ext) || !allowedMime.includes(file.mimetype)) {
    return cb(new Error("Only .pdf and .docx files are allowed"));
  }
  cb(null, true);
}

const limits = { fileSize: 2 * 1024 * 1024 };

const uploadResume = multer({ storage, fileFilter, limits });

module.exports = { uploadResume, UPLOAD_DIR };

