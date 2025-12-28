// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const c = require("../controllers/contactController");
const auth = require("../middleware/auth"); // admin auth for protected endpoints

// Public: create message
router.post("/", c.sendMessage);

// Admin: paginated listing (recommended)
router.get("/", auth, c.getPaginated); // GET /api/contact?page=1&perPage=20

// Admin: legacy/all
router.get("/all", auth, c.getAll);

// Admin: stats / chart / read / delete
router.get("/stats", auth, c.getStats);
router.get("/chart/daily", auth, c.getDailyChart);
router.put("/read/:id", auth, c.markRead);
router.delete("/:id", auth, c.deleteMessage);

// Export CSV (admin)
router.get("/export", auth, c.exportCSV);

module.exports = router;
