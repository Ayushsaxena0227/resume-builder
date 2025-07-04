const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/verifyToken");
const {
  addProject,
  getProjects,
  deleteProject,
} = require("../controllers/projectController");

router.post("/:userId/projects", verifyToken, addProject);
router.get("/:userId/projects", verifyToken, getProjects);
router.delete("/:userId/projects/:projectId", verifyToken, deleteProject);

module.exports = router;
