const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const { getFullResume } = require("../controllers/resumeController");

router.get("/:userId/resume", verifyToken, getFullResume);

module.exports = router;
