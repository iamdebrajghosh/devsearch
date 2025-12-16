const User = require("../models/User");

exports.me = async (req, res) => {
  const user = await User.findById(req.user.userId).select("name email skills preferredRoles createdAt");
  if (!user) return res.status(404).json({ message: "Not found" });
  return res.json(user);
};

exports.updateMe = async (req, res) => {
  const { name, skills, preferredRoles } = req.body;
  const update = {};
  if (typeof name === "string") update.name = name.trim();
  if (Array.isArray(skills)) update.skills = skills;
  if (Array.isArray(preferredRoles)) update.preferredRoles = preferredRoles;
  const user = await User.findByIdAndUpdate(req.user.userId, update, { new: true, runValidators: true }).select("name email skills preferredRoles createdAt");
  if (!user) return res.status(404).json({ message: "Not found" });
  return res.json(user);
};

