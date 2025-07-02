const { db } = require("../firebase/config");

exports.addEducation = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    const eduRef = db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("education")
      .collection("items");

    const newEdu = await eduRef.add(data);

    res.status(200).json({ message: "Education added", id: newEdu.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEducation = async (req, res) => {
  try {
    const { userId } = req.params;

    const eduSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("education")
      .collection("items")
      .get();

    const education = eduSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { userId, educationId } = req.params;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("education")
      .collection("items")
      .doc(educationId)
      .delete();

    res.status(200).json({ message: "Education deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
