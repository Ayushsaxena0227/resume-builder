const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  addSkill,
  getSkills,
  deleteSkill,
} = require("../controllers/skillcontroller");

router.post("/skills", verifyToken, addSkill);
router.get("/skills", verifyToken, getSkills);
router.delete("/skills/:skillId", verifyToken, deleteSkill);

module.exports = router;
