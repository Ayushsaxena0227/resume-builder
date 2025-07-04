const { db } = require("../firebase/config");

exports.addProject = async (req, res) => {
  try {
    const userId = req.user.uid;
    const data = req.body;

    const projectRef = db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items");

    const newProject = await projectRef.add(data);

    res.status(200).json({ message: "Project added", id: newProject.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjects = async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = req.user.uid;

    const projectSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items")
      .get();

    const projects = projectSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.uid;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("projects")
      .collection("items")
      .doc(projectId)
      .delete();

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
