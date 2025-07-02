const { db } = require("../firebase/config");

exports.addAchievement = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    const achRef = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("achievements")
      .collection("items");

    const newAchievement = await achRef.add(data);

    res
      .status(200)
      .json({ message: "Achievement added!", id: newAchievement.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    const { userId } = req.params;

    const achSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("achievements")
      .collection("items")
      .get();

    const achievements = achSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const { userId, achievementId } = req.params;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("achievements")
      .collection("items")
      .doc(achievementId)
      .delete();

    res.status(200).json({ message: "Achievement deleted." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
