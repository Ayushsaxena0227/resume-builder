const express = require("express");
const router = express.Router();
const {
  createSharedResume,
  getSharedResume,
  submitSharedFeedback,
  getAnalytics,
} = require("../controllers/analyticsController");

const verifyToken = require("../Middleware/verifyToken");

// Create a shareable link (Authenticated)
router.post("/share-resume", verifyToken, createSharedResume);

// Public: Fetch resume + increment view count
router.get("/shared/:shareId", getSharedResume);

// Public: Submit feedback for shared resume
router.post("/feedback/:shareId", submitSharedFeedback);

// Get analytics (Authenticated)
router.get("/analytics/:userId", verifyToken, getAnalytics);

module.exports = router;
