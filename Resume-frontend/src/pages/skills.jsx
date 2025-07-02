import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  const userId = "ayush123"; // hardcoded for now (make dynamic later)

  const fetchSkills = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/${userId}/skills`
      );
      setSkills(res.data);
    } catch (error) {
      toast.error("Failed to fetch skills");
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Add skill
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      const res = await axios.post(
        `http://localhost:5000/api/user/${userId}/skills`,
        {
          name: newSkill,
        }
      );
      toast.success("Skill added!");
      setNewSkill("");
      fetchSkills();
    } catch (error) {
      toast.error("Error adding skill");
    }
  };

  // Delete skill
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/${userId}/skills/${id}`
      );
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error) {
      toast.error("Error deleting skill");
    }
  };

  return (
    <section className="py-16 px-[10vw] bg-skills-gradient min-h-screen font-sans">
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
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-md hover:opacity-90 transition"
        >
          Add Skill
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill) => (
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
        ))}
      </div>
    </section>
  );
};

export default Skills;
