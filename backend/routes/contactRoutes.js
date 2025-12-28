const router = require("express").Router();
const c = require("../controllers/contactController");
const auth = require("../middleware/auth");

router.post("/", c.create);
router.get("/", auth, c.list);
router.put("/read/:id", auth, c.markRead);
router.delete("/:id", auth, c.remove);

module.exports = router;
