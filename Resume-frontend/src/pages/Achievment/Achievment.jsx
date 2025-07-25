import React, { useEffect, useState } from "react";
import axios from "axios";
import AddAchievementForm from "./AddAchievmentform";
import AchievementCard from "./AchievmentCard";
import { auth } from "../../Firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AchievementLoader = ({ count = 3 }) => {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#1a1a2e] p-6 rounded-lg border border-gray-700 shadow-md"
        >
          <div className="h-6 bg-gray-600 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-8 bg-gray-800 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderCount, setLoaderCount] = useState(3);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const fetchAchievements = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const userId = user.uid;

      const res = await axios.get(
        `${baseURL}/api/user/${userId}/achievements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data || [];
      setAchievements(data);
      setLoaderCount(data.length > 0 ? data.length : 3);
    } catch (err) {
      console.error("Failed to fetch achievements:", err);
      setLoaderCount(3);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;

    if (!user) return;

    try {
      const token = await user.getIdToken();
      const userId = user.uid;

      await axios.delete(`${baseURL}/api/user/${userId}/achievements/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("achievement deleted");
      fetchAchievements();
    } catch (err) {
      toast.error("failed to delete");
      console.error("Error deleting achievement:", err);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  return (
    <section className="px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom text-white">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">ACHIEVEMENTS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Show off your milestones and certifications
        </p>
      </div>

      {loading ? (
        <AchievementLoader count={loaderCount} />
      ) : (
        <div className=" grid gap-6 sm:grid-cols-2 mb-8">
          {achievements.length > 0 ? (
            achievements.map((ach) => (
              <AchievementCard
                key={ach.id}
                data={ach}
                onDelete={() => handleDelete(ach.id)}
              />
            ))
          ) : (
            <div className="text-center col-span-2 text-gray-400">
              No achievements added yet.
            </div>
          )}
        </div>
      )}

      <AddAchievementForm onAdd={fetchAchievements} />
    </section>
  );
};

export default Achievements;
