const express = require("express");
const router = express.Router();
const {
  addAchievement,
  getAchievements,
  deleteAchievement,
} = require("../controllers/achievementController");

router.post("/:userId/achievements", addAchievement);
router.get("/:userId/achievements", getAchievements);
router.delete("/:userId/achievements/:achievementId", deleteAchievement);

module.exports = router;
