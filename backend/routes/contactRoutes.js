const router = require("express").Router();
const c = require("../controllers/contactController");
const auth = require("../middleware/auth");

router.post("/", c.sendMessage);

router.get("/", auth, c.getPaginated);
router.get("/stats", auth, c.getStats);
router.get("/chart/daily", auth, c.getDailyChart);
router.put("/read/:id", auth, c.markRead);
router.delete("/:id", auth, c.deleteMessage);
router.get("/export", auth, c.exportCSV);

module.exports = router;
