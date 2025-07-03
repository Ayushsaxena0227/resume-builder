const { db } = require("../firebase/config");

exports.getFullResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeRef = db.collection("users").doc(userId).collection("resume");

    const fetchCollection = async (docName) => {
      const snap = await resumeRef.doc(docName).collection("items").get();
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const personalInfoSnap = await resumeRef.doc("personalInfo").get();
    const personalInfo = personalInfoSnap.exists ? personalInfoSnap.data() : {};

    const [skills, education, achievements, experience, projects] =
      await Promise.all([
        fetchCollection("skills"),
        fetchCollection("education"),
        fetchCollection("achievements"),
        fetchCollection("experience"),
        fetchCollection("projects"),
      ]);

    const fullResume = {
      personalInfo,
      skills,
      education,
      achievements,
      experience,
      projects,
    };

    res.status(200).json(fullResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
