const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const uploadController = require("../controllers/upload");

router.use(auth);
router.post("/upload", uploadController);

module.exports = router;
