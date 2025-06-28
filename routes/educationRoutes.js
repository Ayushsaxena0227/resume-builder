const express = require("express");
const router = express.Router();
const {
  addEducation,
  getEducation,
  deleteEducation,
} = require("../controllers/educationController");

router.post("/:userId/education", addEducation);
router.get("/:userId/education", getEducation);
router.delete("/:userId/education/:educationId", deleteEducation);

module.exports = router;
