const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { uploadResume } = require("../config/multer");
const resumeController = require("../controllers/ResumeController");

router.post(
  "/upload",
  auth,
  (req, res, next) => {
    uploadResume.single("resume")(req, res, (err) => {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "File too large (max 2MB)" });
        }
        return res.status(400).json({ message: err.message || "Invalid file" });
      }
      next();
    });
  },
  resumeController.upload
);

router.get("/me", auth, resumeController.getMe);

module.exports = router;
