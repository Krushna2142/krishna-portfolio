const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    req.admin = jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
