const { db } = require("../firebase/config");

exports.addExperience = async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = req.user.uid;
    const data = req.body;

    const expRef = db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("experience")
      .collection("items");

    const newExp = await expRef.add(data);

    res.status(200).json({ message: "Experience added", id: newExp.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getExperience = async (req, res) => {
  try {
    // const { userId } = req.params;
    const userId = req.user.uid;

    const expSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("experience")
      .collection("items")
      .get();

    const experience = expSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(experience);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const userId = req.user.uid;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("experience")
      .collection("items")
      .doc(experienceId)
      .delete();

    res.status(200).json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
