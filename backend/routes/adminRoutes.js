// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, getDashboardData } = require("../controllers/adminController");
const auth = require("../middleware/auth");

router.post("/register", registerAdmin); // remove/disable after initial run
router.post("/login", loginAdmin);
router.get("/dashboard", auth, getDashboardData);

module.exports = router;
