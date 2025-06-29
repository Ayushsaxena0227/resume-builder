const express = require("express");
const router = express.Router();
const {
  addExperience,
  getExperience,
  deleteExperience,
} = require("../controllers/experienceController");

router.post("/:userId/experience", addExperience);
router.get("/:userId/experience", getExperience);
router.delete("/:userId/experience/:experienceId", deleteExperience);

module.exports = router;
