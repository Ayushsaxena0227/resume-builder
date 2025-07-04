const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  addAchievement,
  getAchievements,
  deleteAchievement,
} = require("../controllers/achievementController");

router.post("/:userId/achievements", verifyToken, addAchievement);
router.get("/:userId/achievements", verifyToken, getAchievements);
router.delete(
  "/:userId/achievements/:achievementId",
  verifyToken,
  deleteAchievement
);

module.exports = router;
