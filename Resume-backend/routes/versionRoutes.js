const express = require("express");
const router = express.Router();
const {
  saveResumeVersion,
  getResumeVersions,
  restoreVersion,
} = require("../controllers/versionController");
const verifyToken = require("../Middleware/verifyToken");

router.post("/resume/save-version", verifyToken, saveResumeVersion);
router.get("/resume/versions", verifyToken, getResumeVersions);
router.post("/resume/restore/:versionId", verifyToken, restoreVersion);

module.exports = router;
