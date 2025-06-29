const express = require("express");
const router = express.Router();
const {
  addProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");

router.post("/:userId/projects", addProject);
router.get("/:userId/projects", getProjects);
router.delete("/:userId/projects/:projectId", deleteProject);

module.exports = router;
