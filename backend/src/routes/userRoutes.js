const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { me, updateMe } = require("../controllers/UserController");

router.get("/", auth, (req, res) => {
  res.json(req.user);
});

router.get("/me", auth, me);
router.put("/me", auth, updateMe);

module.exports = router;

