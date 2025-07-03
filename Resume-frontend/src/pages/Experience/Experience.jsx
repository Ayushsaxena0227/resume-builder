import React, { useState, useEffect } from "react";
import axios from "axios";
import ExperienceCard from "./ExperienceCard";
import AddExperienceForm from "./Addexperience";

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const userId = "ayush123"; // make dynamic later

  const fetchExperience = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/${userId}/experience`
      );
      setExperience(res.data);
    } catch (err) {
      console.error("Failed to fetch experience:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/${userId}/experience/${id}`
      );
      fetchExperience();
    } catch (err) {
      console.error("Error deleting experience:", err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return (
    <section className=" px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom-3 text-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">EXPERIENCE</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {experience.map((exp) => (
            <ExperienceCard
              key={exp.id}
              data={exp}
              onDelete={() => handleDelete(exp.id)}
            />
          ))}
        </div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Showcase your previous internships or roles
        </p>
      </div>

      <AddExperienceForm onAdd={fetchExperience} />
    </section>
  );
};

export default Experience;
