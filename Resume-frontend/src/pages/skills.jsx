import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../Firebase/firebase";

const SkillsLoader = ({ count = 6 }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="h-10 w-24 bg-gray-700 rounded-full"></div>
      ))}
    </div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [loaderCount, setLoaderCount] = useState(6);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();
        const res = await axios.get(`${baseURL}/api/user/skills`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = res.data || [];
        setSkills(data);
        setLoaderCount(data.length > 0 ? data.length : 6);
      } catch (err) {
        console.error("Error fetching skills:", err);
        toast.error("Failed to load skills");
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.post(
        `${baseURL}/api/user/skills`,
        { name: newSkill },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Skill added!");
      setNewSkill("");
      // Re-fetch skills after adding
      const res = await axios.get(`${baseURL}/api/user/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSkills(res.data || []);
    } catch (error) {
      console.error("Add failed", error);
      toast.error("Error adding skill");
    }
  };

  const handleDelete = async (id) => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();

      await axios.delete(`${baseURL}/api/user/skills/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Skill deleted");
      setSkills((prevSkills) => prevSkills.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Error deleting skill");
    }
  };

  return (
    <section className=" min-h-screen text-white space-y-8">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        SKILLS
      </h2>
      <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-10">
        <input
          type="text"
          placeholder="Enter a skill"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
        />
        <button
          onClick={handleAddSkill}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-md hover:opacity-80 transition"
        >
          Add Skill
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {loading ? (
          <SkillsLoader count={loaderCount} />
        ) : skills.length > 0 ? (
          skills.map((skill) => (
            <div
              key={skill.id}
              className="flex items-center px-4 py-2 bg-[#0d081f] text-white border border-gray-600 rounded-full shadow-md backdrop-blur-md"
            >
              <span className="mr-2">{skill.name}</span>
              <button
                onClick={() => handleDelete(skill.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400 w-full mt-4">
            No skills added yet.
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
