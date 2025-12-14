const jwt = require("jsonwebtoken");

function signAccessToken(payload) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("JWT_REFRESH_SECRET is not set");
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

module.exports = { signAccessToken, signRefreshToken };

