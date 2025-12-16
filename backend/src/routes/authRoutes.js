const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const jwt = require("jsonwebtoken");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = jwt.sign(
      { userId: payload.userId, email: payload.email },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
    return res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = router;
