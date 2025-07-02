const { db } = require("../firebase/config");
// Add or Update Personal Info
exports.setPersonalInfo = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;

    await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("personalInfo")
      .set(data);
    res.status(200).json({ message: "Personal info saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  Get Personal Info
exports.getPersonalInfo = async (req, res) => {
  try {
    const { userId } = req.params;

    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("resume")
      .doc("personalInfo")
      .get();

    if (!doc.exists) {
      return res.status(404).json({ message: "No personal info found." });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
