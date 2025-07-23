const express = require("express");
const router = express.Router();
const {
  shareResume,
  submitFeedback,
  getFeedbacks,
  getAnalytics,
} = require("../controllers/feedbackController");
const verifyToken = require("../Middleware/verifyToken");

// Create optional authentication middleware
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // No token provided, continue without authentication
    req.user = null;
    return next();
  }

  // If token is provided, try to verify it
  verifyToken(req, res, (err) => {
    if (err) {
      // Token verification failed, continue without authentication
      req.user = null;
    }
    next();
  });
};

router.get("/analytics", verifyToken, getAnalytics);

// Public: Resume preview + feedback submission (with optional auth to identify owner)
router.get("/resume/shared/:userId", optionalAuth, shareResume);
router.post("/resume/feedback/:userId", submitFeedback);

// only for authenticated user
router.get("/resume/feedbacks", verifyToken, getFeedbacks);

module.exports = router;
