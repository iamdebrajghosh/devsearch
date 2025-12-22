const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { recommend } = require("../controllers/AiController");

router.post("/recommend", auth, recommend);

module.exports = router;

