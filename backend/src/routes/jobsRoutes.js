const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const jobsController = require("../controllers/JobsController");

router.get("/match", auth, jobsController.match);

module.exports = router;

