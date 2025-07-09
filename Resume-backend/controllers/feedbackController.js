const { db } = require("../firebase/config");

exports.shareResume = async (req, res) => {
  try {
    const { userId } = req.params;
    const resumeRef = db.collection("users").doc(userId).collection("resume");

    const fetchCollection = async (name) => {
      const snap = await resumeRef.doc(name).collection("items").get();
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    const personalInfoSnap = await resumeRef.doc("personalInfo").get();
    const personalInfo = personalInfoSnap.exists ? personalInfoSnap.data() : {};

    const [skills, education, experience, projects, achievements] =
      await Promise.all([
        fetchCollection("skills"),
        fetchCollection("education"),
        fetchCollection("experience"),
        fetchCollection("projects"),
        fetchCollection("achievements"),
      ]);

    res
      .status(200)
      .json({
        personalInfo,
        skills,
        education,
        experience,
        projects,
        achievements,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, message } = req.body;

    await db
      .collection("users")
      .doc(userId)
      .collection("feedbacks")
      .add({ name, email, message, timestamp: new Date() });

    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeedbacks = async (req, res) => {
  try {
    const userId = req.user.uid;

    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("feedbacks")
      .orderBy("timestamp", "desc")
      .get();
    const feedbacks = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
