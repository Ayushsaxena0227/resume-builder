const express = require("express");
const router = express.Router();

const {
  addSkill,
  getSkills,
  deleteSkill,
} = require("../controllers/skillcontroller");

router.post("/:userId/skills", addSkill);
router.get("/:userId/skills", getSkills);
router.delete("/:userId/skills/:skillId", deleteSkill);

module.exports = router;
