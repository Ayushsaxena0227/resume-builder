const { db } = require("../firebase/config");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");

// Helper: Fetch resume snapshot
const getResumeSnapshot = async (userId) => {
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

  return {
    personalInfo,
    skills,
    education,
    experience,
    projects,
    achievements,
  };
};

// 🔹 POST /share-resume
exports.createSharedResume = async (req, res) => {
  try {
    const { selectedSections = [] } = req.body;
    const userId = req.user.uid;
    const shareId = uuidv4();

    const resumeData = await getResumeSnapshot(userId);

    await db.collection("sharedResumes").doc(shareId).set({
      createdBy: userId,
      createdAt: Date.now(),
      viewCount: 0,
      data: resumeData,
    });

    res.status(200).json({ shareId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET /shared/:shareId
exports.getSharedResume = async (req, res) => {
  try {
    const { shareId } = req.params;
    const docRef = db.collection("sharedResumes").doc(shareId);
    const doc = await docRef.get();

    if (!doc.exists) return res.status(404).json({ error: "Not found" });

    // Increment view count
    await docRef.update({
      viewCount: admin.firestore.FieldValue.increment(1),
    });

    res.status(200).json(doc.data().data); // only resume snapshot
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 POST /feedback/:shareId
exports.submitSharedFeedback = async (req, res) => {
  try {
    const { shareId } = req.params;
    const { name, email, message } = req.body;

    await db
      .collection("sharedResumes")
      .doc(shareId)
      .collection("feedback")
      .add({ name, email, message, submittedAt: Date.now() });

    res.status(200).json({ message: "Feedback submitted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 GET /analytics/:userId
exports.getAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db
      .collection("sharedResumes")
      .where("createdBy", "==", userId)
      .get();

    const analytics = [];

    for (const doc of snapshot.docs) {
      const shareId = doc.id;
      const data = doc.data();
      const viewCount = data.viewCount || 0;

      const feedbackSnap = await db
        .collection("sharedResumes")
        .doc(shareId)
        .collection("feedback")
        .get();

      analytics.push({
        shareId,
        viewCount,
        feedbackCount: feedbackSnap.size,
      });
    }

    res.status(200).json(analytics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
