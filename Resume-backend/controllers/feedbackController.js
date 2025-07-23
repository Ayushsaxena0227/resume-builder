const { db, admin } = require("../firebase/config");

// Updated shareResume function with proper view tracking logic
exports.shareResume = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("=== SHARE RESUME REQUEST ===");
    console.log("Requested userId:", userId);
    console.log("Query params:", req.query); // NEW: Log all query params to confirm ?owner=true etc.

    // Validate userId format
    if (!userId || userId.length < 10) {
      return res.status(400).json({
        error: "Invalid user ID format",
        received: userId,
      });
    }

    // Check if user document exists
    const userDocRef = db.collection("users").doc(userId);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      console.log("User document not found");
      return res.status(404).json({
        error: "User not found",
        requestedId: userId,
      });
    }

    console.log("User document exists, fetching resume data...");

    // Parse query parameters
    const isOwnerCheck = req.query.owner === "true";
    const isPreview = req.query.preview === "true";

    // Get the authenticated user's ID if available
    const authenticatedUserId = req.user?.uid;

    // Determine if this is a public view (unauthenticated request)
    const isPublicView = !req.user; // NEW: True for public (no auth), false for authenticated requests

    // Determine if this is a legitimate public view that should be counted
    const shouldTrackView =
      isPublicView &&
      !isOwnerCheck &&
      !isPreview &&
      (!authenticatedUserId || authenticatedUserId !== userId); // Don't count if owner is viewing (even if authenticated)

    console.log("View tracking decision:", {
      isPublicView,
      isOwnerCheck,
      isPreview,
      authenticatedUserId,
      requestedUserId: userId,
      shouldTrackView,
    });

    // Only track views for actual public visits from non-owners
    if (shouldTrackView) {
      // Create a more unique session identifier (FIXED: Removed Date.now() to allow proper cooldown)
      const clientIP =
        req.ip ||
        req.connection.remoteAddress ||
        req.headers["x-forwarded-for"] ||
        "unknown";
      const userAgent = req.get("User-Agent") || "unknown";
      const referer = req.get("Referer") || "direct";

      // Create a hash of the session info to make it more unique (stable across requests from same visitor)
      const crypto = require("crypto");
      const sessionKey = crypto
        .createHash("md5")
        .update(`${clientIP}-${userAgent}-${referer}`)
        .digest("hex");

      const viewRef = db
        .collection("users")
        .doc(userId)
        .collection("analytics")
        .doc("resumeViews");

      // Use transaction for atomic check and update to prevent race conditions
      await db.runTransaction(async (transaction) => {
        const currentAnalytics = await transaction.get(viewRef);
        const analyticsData = currentAnalytics.exists
          ? currentAnalytics.data()
          : { views: 0, recentViews: {} };

        const now = admin.firestore.Timestamp.now();
        const recentViews = analyticsData.recentViews || {};

        // Check if this session has viewed recently (within 30 minutes)
        const lastViewTime = recentViews[sessionKey];
        const timeDiff = lastViewTime
          ? now.seconds - lastViewTime.seconds
          : Infinity;

        const shouldIncrement = timeDiff > 30 * 60; // 30 minutes cooldown

        if (shouldIncrement) {
          // Clean up old entries (older than 2 hours) to prevent memory bloat
          const twoHoursAgo = now.seconds - 2 * 60 * 60;
          const cleanedRecentViews = {};

          Object.entries(recentViews).forEach(([key, timestamp]) => {
            if (timestamp.seconds > twoHoursAgo) {
              cleanedRecentViews[key] = timestamp;
            }
          });

          // Add current view
          cleanedRecentViews[sessionKey] = now;

          transaction.set(
            viewRef,
            {
              views: admin.firestore.FieldValue.increment(1),
              lastViewed: now,
              recentViews: cleanedRecentViews,
            },
            { merge: true }
          );
          console.log(
            "🔥 NEW PUBLIC VIEW COUNTED for session:",
            sessionKey.substring(0, 8) + "..."
          );
        } else {
          console.log(
            "⏰ Recent view from same session - not counting (last viewed:",
            Math.floor(timeDiff / 60),
            "minutes ago)"
          );
        }
      });
    } else {
      if (authenticatedUserId === userId) {
        console.log("👤 Owner viewing their own resume - no view tracking");
      } else if (isPreview) {
        console.log("👁️ Preview mode - no view tracking");
      } else if (isOwnerCheck) {
        console.log("🔍 Owner check mode - no view tracking");
      } else {
        console.log(
          "🔍 Internal or authenticated non-owner check - no view tracking"
        );
      }
    }

    // Fetch resume data (unchanged)
    const resumeRef = db.collection("users").doc(userId).collection("resume");

    const fetchCollection = async (collectionName) => {
      try {
        const collectionRef = resumeRef.doc(collectionName).collection("items");
        const snapshot = await collectionRef.get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return items;
      } catch (error) {
        console.warn(`Error fetching ${collectionName}:`, error.message);
        return [];
      }
    };

    const personalInfoRef = resumeRef.doc("personalInfo");
    const personalInfoSnap = await personalInfoRef.get();
    const personalInfo = personalInfoSnap.exists ? personalInfoSnap.data() : {};

    const [skills, education, experience, projects, achievements] =
      await Promise.all([
        fetchCollection("skills"),
        fetchCollection("education"),
        fetchCollection("experience"),
        fetchCollection("projects"),
        fetchCollection("achievements"),
      ]);

    const resumeData = {
      personalInfo,
      skills,
      education,
      experience,
      projects,
      achievements,
      metadata: {
        userId,
        fetchedAt: new Date(),
        hasPersonalInfo: personalInfoSnap.exists,
        totalSections: {
          skills: skills.length,
          education: education.length,
          experience: experience.length,
          projects: projects.length,
          achievements: achievements.length,
        },
      },
    };

    const hasContent =
      personalInfoSnap.exists ||
      skills.length > 0 ||
      education.length > 0 ||
      experience.length > 0 ||
      projects.length > 0 ||
      achievements.length > 0;

    if (!hasContent) {
      return res.status(404).json({
        error: "Resume not found or empty",
        userId,
      });
    }

    res.status(200).json(resumeData);
  } catch (error) {
    console.error("=== ERROR IN SHARE RESUME ===");
    console.error("Error:", error);
    res.status(500).json({
      error: "Internal server error while fetching resume",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Other functions remain the same (unchanged)
exports.getFeedbacks = async (req, res) => {
  try {
    const userId = req.user.uid;

    const feedbacksSnap = await db
      .collection("users")
      .doc(userId)
      .collection("feedbacks")
      .orderBy("timestamp", "desc")
      .get();

    const feedbacks = [];
    feedbacksSnap.forEach((doc) => {
      feedbacks.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate().toISOString() || null,
      });
    });

    res.status(200).json({
      userId,
      feedbacks,
      totalCount: feedbacks.length,
    });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({
      error: "Failed to fetch feedbacks",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const userId = req.user.uid;

    const analyticsDoc = await db
      .collection("users")
      .doc(userId)
      .collection("analytics")
      .doc("resumeViews")
      .get();

    const analyticsData = analyticsDoc.exists
      ? analyticsDoc.data()
      : { views: 0, lastViewed: null };

    const feedbackSnap = await db
      .collection("users")
      .doc(userId)
      .collection("feedbacks")
      .get();

    const feedbackCount = feedbackSnap.size;

    res.status(200).json([
      {
        id: userId,
        views: analyticsData.views || 0,
        lastViewed: analyticsData.lastViewed
          ? analyticsData.lastViewed.toDate().toISOString()
          : null,
        feedbackCount,
      },
    ]);
  } catch (err) {
    console.error("Failed to get analytics:", err.message);
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
