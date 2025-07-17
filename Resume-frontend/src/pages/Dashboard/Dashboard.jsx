import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import SummaryCard from "./SummaryCard";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResumeScorer from "../Ai/ResumeScorer";

const DashboardLoader = () => (
  <div className="min-h-screen text-white space-y-8 animate-pulse">
    <div className="text-center">
      <div className="h-10 bg-gray-600 rounded w-1/3 mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-[#1a1a2e] rounded-lg p-6 border border-gray-700"
        >
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>

    <div className="text-center mt-10">
      <div className="h-10 bg-gray-600 rounded w-64 mx-auto"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);

      toast.success("Logged out successfully!");

      setTimeout(() => {
        navigate("/signup");
      }, 1000);
    } catch (error) {
      toast.error("Failed to logout");
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      if (!currentUser) return;

      try {
        const token = await currentUser.getIdToken();
        const res = await axios.get(
          `${baseURL}/api/user/${currentUser.uid}/resume`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setResume(res.data);
      } catch (err) {
        console.error(
          "Failed to load resume",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [currentUser]);

  if (loading) return <DashboardLoader />;

  if (!resume) {
    return (
      <div className="p-8 bg-[#0d081f] min-h-screen text-white">
        <p className="text-center text-xl">No resume data available.</p>
      </div>
    );
  }

  const {
    personalInfo = {},
    education = [],
    skills = [],
    experience = [],
    achievements = [],
    projects = [],
  } = resume;

  return (
    <div className="min-h-screen text-white space-y-8 px-4 sm:px-8 lg:px-16 py-10">
      <ToastContainer />

      <h2 className="text-4xl font-bold text-center">
        Welcome! {personalInfo.fullName?.split(" ")[0]} <br />
        Your Dashboard Summary
      </h2>

      <div className="text-center">
        {currentUser ? (
          <div className="flex justify-center gap-4 items-center flex-wrap mt-4">
            <ResumeScorer />

            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/signup"
            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition mt-4 inline-block"
          >
            Sign up
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SummaryCard title="Personal Info">
          <p>Name: {personalInfo.fullName || "N/A"}</p>
          <p>Email: {personalInfo.email || "N/A"}</p>
          <p>Phone: {personalInfo.phone || "N/A"}</p>
        </SummaryCard>

        <SummaryCard title="Education">
          {education.length > 0 ? (
            <>
              <p>{education[0].degree}</p>
              <p>{education[0].institute}</p>
            </>
          ) : (
            <p>No education added</p>
          )}
        </SummaryCard>

        <SummaryCard title="Skills">
          {skills.length > 0 ? (
            <ul className="list-disc ml-4">
              {skills.slice(0, 5).map((skill, i) => (
                <li key={i}>{skill.name}</li>
              ))}
            </ul>
          ) : (
            <p>No skills added</p>
          )}
        </SummaryCard>

        <SummaryCard title="Experience">
          {experience.length > 0 ? (
            <p>
              {experience[0].role} @ {experience[0].company}
            </p>
          ) : (
            <p>No experience added</p>
          )}
        </SummaryCard>

        <SummaryCard title="Achievements">
          {achievements.length > 0 ? (
            <p>{achievements[0].title}</p>
          ) : (
            <p>No achievements added</p>
          )}
        </SummaryCard>

        <SummaryCard title="Projects">
          {projects.length > 0 ? (
            <>
              <p>{projects[0].title}</p>
              <p className="text-sm text-gray-400">
                {Array.isArray(projects[0].tech)
                  ? projects[0].tech.join(", ")
                  : "N/A"}
              </p>
            </>
          ) : (
            <p>No projects added</p>
          )}
        </SummaryCard>
      </div>

      <div className="mt-10"></div>

      <div className="text-center mt-10">
        <Link to="/resume-preview">
          <button className="bg-gradient-to-r from-purple-600 to-pink-500 py-3 px-6 rounded-md text-white font-semibold hover:opacity-90 transition">
            Go to Resume Preview & Download PDF
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
