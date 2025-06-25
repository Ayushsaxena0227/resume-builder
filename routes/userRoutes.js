const express = require("express");
const router = express.Router();
const {
  setPersonalInfo,
  getPersonalInfo,
} = require("../controllers/userController");

router.post("/:userId/personal", setPersonalInfo);

router.get("/:userId/personal", getPersonalInfo);

module.exports = router;
