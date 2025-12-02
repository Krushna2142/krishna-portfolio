// backend/middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.replace(/^Bearer\s*/i, "");
    if (!token) return res.status(401).json({ ok: false, error: "Unauthorized" });

    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.admin = data;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
};
