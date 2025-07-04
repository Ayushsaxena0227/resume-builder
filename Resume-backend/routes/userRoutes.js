const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  setPersonalInfo,
  getPersonalInfo,
} = require("../controllers/userController");

router.post("/:userId/personal", verifyToken, setPersonalInfo);

router.get("/:userId/personal", verifyToken, getPersonalInfo);

module.exports = router;
