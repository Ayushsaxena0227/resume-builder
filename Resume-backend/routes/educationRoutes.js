const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  addEducation,
  getEducation,
  deleteEducation,
} = require("../controllers/educationController");

router.post("/:userId/education", verifyToken, addEducation);
router.get("/:userId/education", verifyToken, getEducation);
router.delete("/:userId/education/:educationId", verifyToken, deleteEducation);

module.exports = router;
