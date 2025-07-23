import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { auth } from "../../Firebase/firebase"; // Update path as needed
import FeedbackForm from "./FeedbackForm";

const ResumeSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 font-sans animate-pulse">
      <div className="bg-gray-800 p-6 rounded-lg shadow mb-10">
        <div className="h-6 bg-gray-600 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-1"></div>
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-1"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-1"></div>
      </div>

      {[...Array(3)].map((_, index) => (
        <div key={index} className="mb-10">
          <div className="h-6 bg-purple-700 w-2/5 mb-4 rounded"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-800 w-2/4 rounded"></div>
            <div className="h-4 bg-gray-700 w-full rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const PublicResumeView = () => {
  const { userId } = useParams();
  const location = useLocation();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  // Prevent multiple requests for same userId
  const hasFetchedRef = useRef(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchResume = async () => {
      // Prevent duplicate calls
      if (hasFetchedRef.current) {
        console.log("🚫 Preventing duplicate request for userId:", userId);
        return;
      }

      if (!userId) {
        console.log("❌ No userId provided");
        setError("No user ID provided");
        setLoading(false);
        return;
      }

      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();
      hasFetchedRef.current = true;

      try {
        console.log("📡 Fetching PUBLIC resume for userId:", userId);

        // Check if this is a preview mode from query params
        const isPreview = location.search.includes("preview=true");

        // Get current user to determine if they're the owner
        const currentUser = auth.currentUser;
        const isOwner = currentUser?.uid === userId;

        // Build query parameters
        const queryParams = new URLSearchParams({
          public: "true",
          ...(isOwner && { owner: "true" }),
          ...(isPreview && { preview: "true" }),
        });

        // Prepare headers
        const headers = {
          "Content-Type": "application/json",
        };

        // Add auth token if user is logged in
        if (currentUser) {
          try {
            const token = await currentUser.getIdToken();
            headers.Authorization = `Bearer ${token}`;
          } catch (tokenError) {
            console.warn("Failed to get auth token:", tokenError);
          }
        }

        console.log("Request params:", {
          isPreview,
          isOwner,
          queryString: queryParams.toString(),
        });

        const response = await axios.get(
          `${baseURL}/api/user/resume/shared/${userId}?${queryParams.toString()}`,
          {
            signal: abortControllerRef.current.signal,
            timeout: 10000,
            headers,
          }
        );

        console.log("✅ Resume data fetched successfully:", response.data);
        setResumeData(response.data);
        setError(null);
      } catch (error) {
        // Don't set error if request was cancelled
        if (error.name === "CanceledError" || error.code === "ERR_CANCELED") {
          console.log("🚫 Request cancelled");
          return;
        }

        console.error("❌ Failed to fetch resume:", error);
        setError(error.response?.data?.error || "Failed to load resume");

        // Allow retry on error by resetting the flag
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    };

    // Reset state when userId changes
    if (userId) {
      hasFetchedRef.current = false;
      setResumeData(null);
      setError(null);
      setLoading(true);
      fetchResume();
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [userId, baseURL, location.search]);

  // Add visibility change listener to prevent multiple requests when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("🔍 Page hidden");
      } else {
        console.log("👁️ Page visible - but not refetching (already have data)");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleRetry = () => {
    hasFetchedRef.current = false;
    setError(null);
    setLoading(true);
    setResumeData(null);
    // The useEffect will trigger automatically when error state changes
  };

  if (loading) {
    return <ResumeSkeletonLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded transition-colors"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">
            Resume Not Found
          </h2>
          <p className="text-gray-300">
            The requested resume could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 font-sans">
      {/* Personal Info */}
      {resumeData.personalInfo && (
        <div className="bg-gray-800 p-6 rounded-lg shadow mb-10">
          <h1 className="text-3xl font-bold mb-2">
            {resumeData.personalInfo.fullName || "Name Not Available"}
          </h1>
          <p className="text-purple-400 mb-2">
            {resumeData.personalInfo.email || "Email Not Available"}
          </p>
          <p className="text-gray-300 mb-2">
            {resumeData.personalInfo.phone || "Phone Not Available"}
          </p>
          {resumeData.personalInfo.summary && (
            <p className="text-gray-300 mt-4">
              {resumeData.personalInfo.summary}
            </p>
          )}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <span
                key={skill.id || index}
                className="bg-purple-600 px-3 py-1 rounded-full text-sm"
              >
                {skill.name || skill.skill || "Skill"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            Experience
          </h2>
          {resumeData.experience.map((exp, index) => (
            <div
              key={exp.id || index}
              className="mb-6 border-l-4 border-purple-600 pl-4"
            >
              <h3 className="text-xl font-semibold">
                {exp.position || exp.title || "Position"}
              </h3>
              <p className="text-purple-300">{exp.company || "Company"}</p>
              <p className="text-gray-400 text-sm mb-2">
                {exp.startDate || "Start"} -{" "}
                {exp.endDate || exp.current ? "Present" : "End"}
              </p>
              {exp.description && (
                <p className="text-gray-300">{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Education</h2>
          {resumeData.education.map((edu, index) => (
            <div
              key={edu.id || index}
              className="mb-6 border-l-4 border-purple-600 pl-4"
            >
              <h3 className="text-xl font-semibold">
                {edu.degree || "Degree"}
              </h3>
              <p className="text-purple-300">
                {edu.institution || edu.school || "Institution"}
              </p>
              <p className="text-gray-400 text-sm">
                {edu.startDate || edu.year || "Year"} - {edu.endDate || "End"}
              </p>
              {edu.gpa && <p className="text-gray-300">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">Projects</h2>
          {resumeData.projects.map((project, index) => (
            <div
              key={project.id || index}
              className="mb-6 border-l-4 border-purple-600 pl-4"
            >
              <h3 className="text-xl font-semibold">
                {project.name || project.title || "Project"}
              </h3>
              {project.technologies && (
                <p className="text-purple-300 mb-2">
                  Tech: {project.technologies}
                </p>
              )}
              {project.description && (
                <p className="text-gray-300 mb-2">{project.description}</p>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Achievements */}
      {resumeData.achievements && resumeData.achievements.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-purple-400 mb-4">
            Achievements
          </h2>
          {resumeData.achievements.map((achievement, index) => (
            <div
              key={achievement.id || index}
              className="mb-4 border-l-4 border-purple-600 pl-4"
            >
              <h3 className="text-lg font-semibold">
                {achievement.title || "Achievement"}
              </h3>
              {achievement.description && (
                <p className="text-gray-300">{achievement.description}</p>
              )}
              {achievement.date && (
                <p className="text-gray-400 text-sm">{achievement.date}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Feedback Form */}
      <div className="mt-16">
        <FeedbackForm userId={userId} />
      </div>
    </div>
  );
};

export default PublicResumeView;
