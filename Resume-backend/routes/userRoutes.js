const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  setPersonalInfo,
  getPersonalInfo,
} = require("../controllers/userController");

router.post("/personal", verifyToken, setPersonalInfo);

router.get("/personal", verifyToken, getPersonalInfo);

module.exports = router;
