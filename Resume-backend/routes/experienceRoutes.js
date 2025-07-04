const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  addExperience,
  getExperience,
  deleteExperience,
} = require("../controllers/experienceController");

router.post("/:userId/experience", verifyToken, addExperience);
router.get("/:userId/experience", verifyToken, getExperience);
router.delete(
  "/:userId/experience/:experienceId",
  verifyToken,
  deleteExperience
);

module.exports = router;
