const { db } = require("../firebase/config");

//  Add a new skill
exports.addSkill = async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = req.user.uid;
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Skill name is required." });

    const skillRef = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("skills");
    const skillsCollection = skillRef.collection("items");

    const newSkill = await skillsCollection.add({ name });

    res
      .status(200)
      .json({ message: "Skill added successfully!", id: newSkill.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get all skills
exports.getSkills = async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = req.user.uid;

    const skillsSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("skills")
      .collection("items")
      .get();

    const skills = skillsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Delete a skill by skillId
exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const userId = req.user.uid;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("skills")
      .collection("items")
      .doc(skillId)
      .delete();

    res.status(200).json({ message: "Skill deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
