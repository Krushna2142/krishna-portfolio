// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getDashboardData } = require("../controllers/adminController");
const auth = require("../middleware/auth");

// ⚠️ Keep register only for first admin creation, comment/remove after
// router.post("/register", registerAdmin);

router.post("/login", loginAdmin);
router.get("/dashboard", auth, getDashboardData);

module.exports = router;
