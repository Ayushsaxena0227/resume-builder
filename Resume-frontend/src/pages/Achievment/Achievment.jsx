import React, { useEffect, useState } from "react";
import axios from "axios";
import AddAchievementForm from "./AddAchievmentform";
import AchievementCard from "./AchievmentCard";

const Achievements = () => {
  const userId = "ayush123";
  const [achievements, setAchievements] = useState([]);

  const fetchAchievements = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/user/${userId}/achievements`
      );
      setAchievements(res.data);
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/${userId}/achievements/${id}`
      );
      fetchAchievements();
    } catch (err) {
      console.error("Error deleting achievement:", err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <section className=" px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">ACHIEVEMENTS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {achievements.map((ach) => (
            <AchievementCard
              key={ach.id}
              data={ach}
              onDelete={() => handleDelete(ach.id)}
            />
          ))}
        </div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Show off your milestones and certifications
        </p>
      </div>

      <AddAchievementForm onAdd={fetchAchievements} />
    </section>
  );
};

export default Achievements;
