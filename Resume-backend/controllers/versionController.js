const { db, admin } = require("../firebase/config");

// ✅ Save the current state of the resume as a version
exports.saveResumeVersion = async (req, res) => {
  try {
    const userId = req.user.uid;
    const resumeRef = db.collection("users").doc(userId).collection("resume");

    // Get current version count to determine next version number
    const existingVersionsSnap = await db
      .collection("users")
      .doc(userId)
      .collection("resumeVersions")
      .get();

    const versionNumber = existingVersionsSnap.size + 1;

    // Fetch a resume section like skills, projects, etc.
    const fetchSection = async (section) => {
      const snap = await resumeRef.doc(section).collection("items").get();
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    };

    // Fetch each section's data
    const personalInfoSnap = await resumeRef.doc("personalInfo").get();
    const personalInfo = personalInfoSnap.exists ? personalInfoSnap.data() : {};

    const [skills, education, experience, projects, achievements] =
      await Promise.all([
        fetchSection("skills"),
        fetchSection("education"),
        fetchSection("experience"),
        fetchSection("projects"),
        fetchSection("achievements"),
      ]);

    const versionData = {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      versionNumber: versionNumber, // Add version number
      versionName: `Resume ${versionNumber}`, // Add version name
      data: {
        personalInfo,
        skills,
        education,
        experience,
        projects,
        achievements,
      },
    };

    await db
      .collection("users")
      .doc(userId)
      .collection("resumeVersions")
      .add(versionData);

    res
      .status(200)
      .json({ message: `Resume ${versionNumber} saved successfully!` });
  } catch (err) {
    console.error("Error saving version:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getResumeVersions = async (req, res) => {
  try {
    const userId = req.user.uid;

    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("resumeVersions")
      .orderBy("createdAt", "desc")
      .get();

    const versions = snap.docs.map((doc) => {
      const data = doc.data();
      let formattedDate;

      // Handle different date formats
      if (data.createdAt) {
        try {
          if (data.createdAt.toDate) {
            formattedDate = data.createdAt.toDate().toISOString();
          } else if (data.createdAt instanceof Date) {
            formattedDate = data.createdAt.toISOString();
          } else {
            formattedDate = new Date(data.createdAt).toISOString();
          }
        } catch (err) {
          console.error("Error parsing createdAt:", err);
          formattedDate = new Date().toISOString();
        }
      } else {
        formattedDate = new Date().toISOString();
      }

      return {
        id: doc.id,
        ...data,
        createdAt: formattedDate,
      };
    });

    res.status(200).json(versions);
  } catch (err) {
    console.error("Error in getResumeVersions:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.restoreVersion = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { versionId } = req.params;

    const doc = await db
      .collection("users")
      .doc(userId)
      .collection("resumeVersions")
      .doc(versionId)
      .get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Version not found." });
    }

    const versionData = doc.data().data;
    const resumeRef = db.collection("users").doc(userId).collection("resume");

    await resumeRef.doc("personalInfo").set(versionData.personalInfo || {});

    const setItems = async (sectionName, items) => {
      const sectionRef = resumeRef.doc(sectionName).collection("items");
      const existingDocs = await sectionRef.get();
      const batch = db.batch();

      existingDocs.forEach((doc) => batch.delete(doc.ref));

      items.forEach((item) => {
        const newDoc = sectionRef.doc();
        batch.set(newDoc, item);
      });

      await batch.commit();
    };

    await Promise.all([
      setItems("skills", versionData.skills || []),
      setItems("education", versionData.education || []),
      setItems("experience", versionData.experience || []),
      setItems("projects", versionData.projects || []),
      setItems("achievements", versionData.achievements || []),
    ]);

    res.status(200).json({ message: "Resume restored to this version." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
