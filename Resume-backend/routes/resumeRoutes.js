const express = require("express");
const router = express.Router();
const { getFullResume } = require("../controllers/resumeController");

router.get("/:userId/resume", getFullResume);

module.exports = router;
