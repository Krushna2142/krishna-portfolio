// backend/routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/contactController");
const auth = require("../middleware/auth");

router.post("/", controller.sendMessage);

// admin routes protected by auth
router.get("/", auth, controller.getPaginated); // New paginated endpoint
router.get("/all", auth, controller.getAll);
router.get("/export", auth, controller.exportCSV); // New CSV export endpoint
router.get("/stats", auth, controller.getStats);
router.get("/chart/daily", auth, controller.getDailyChart);
router.put("/read/:id", auth, controller.markRead);
router.delete("/:id", auth, controller.deleteMessage);

module.exports = router;
