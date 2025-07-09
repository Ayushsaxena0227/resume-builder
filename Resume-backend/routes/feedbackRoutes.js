const express = require("express");
const router = express.Router();
const {
  shareResume,
  submitFeedback,
  getFeedbacks,
} = require("../controllers/feedbackController");
const verifyToken = require("../Middleware/verifyToken");

// Public: Resume preview + feedback submission
router.get("/resume/shared/:userId", shareResume);
router.post("/resume/feedback/:userId", submitFeedback);

// only for authenticated user
router.get("/resume/feedbacks", verifyToken, getFeedbacks);

module.exports = router;
