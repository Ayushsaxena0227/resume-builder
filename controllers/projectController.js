const { db } = require("../firebase/config");

exports.addProject = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    const projectRef = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items");

    const newProject = await projectRef.add(data);

    res.status(200).json({ message: "Project added successfully", id: newProject.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const projectsSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items")
      .get();

    const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    const { userId, projectId } = req.params;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items")
      .doc(projectId)
      .delete();

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
