const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("DevSearch API is live. Use /api/health for status.");
});

app.get("/api/health", (req, res) => {
  res.send("OK");
});

app.use("/api/auth", authRoutes);
const userRoutes = require("./src/routes/userRoutes");
app.use("/api/user", userRoutes);
app.use("/uploads", express.static("uploads"));
const resumeRoutes = require("./src/routes/resumeRoutes");
app.use("/api/resume", resumeRoutes);
const jobsRoutes = require("./src/routes/jobsRoutes");
app.use("/api/jobs", jobsRoutes);
const aiRoutes = require("./src/routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB error:", err.message);
    process.exit(1);
  });
