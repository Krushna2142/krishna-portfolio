// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");
const auth = require("../middleware/auth");

router.post("/", controller.sendMessage);

// Paginated GET endpoint with search/filter (protected by auth)
router.get("/", auth, controller.getPaginated);

// CSV export endpoint (protected by auth)
router.get("/export", auth, controller.exportCSV);

// admin routes protected by auth
router.get("/all", auth, controller.getAll);
router.get("/stats", auth, controller.getStats);
router.get("/chart/daily", auth, controller.getDailyChart);
router.put("/read/:id", auth, controller.markRead);
router.delete("/:id", auth, controller.deleteMessage);

module.exports = router;
