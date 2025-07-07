const express = require("express");
const router = express.Router();
const {
  getKeywordSuggestions,
} = require("../controllers/ai/keywordSuggestions");

router.post("/keyword-suggestions", getKeywordSuggestions);

module.exports = router;
