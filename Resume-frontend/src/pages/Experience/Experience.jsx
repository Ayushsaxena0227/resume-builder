import React, { useState, useEffect } from "react";
import axios from "axios";
import ExperienceCard from "./ExperienceCard";
import AddExperienceForm from "./Addexperience";
import { auth } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const ExperienceLoader = ({ count = 3 }) => {
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

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderCount, setLoaderCount] = useState(3);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const fetchExperience = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not logged in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();
      const res = await axios.get(
        `${baseURL}/api/user/${user.uid}/experience`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data || [];
      setExperience(data);
      setLoaderCount(data.length > 0 ? data.length : 3);
    } catch (err) {
      console.error("Failed to fetch experience:", err);
      setLoaderCount(3);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;

    if (!user) {
      console.warn("Delete failed: User not logged in.");
      return;
    }

    try {
      const token = await user.getIdToken();

      await toast.promise(
        axios.delete(`${baseURL}/api/user/${user.uid}/experience/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          pending: "Deleting experience...",
          success: {
            render: "Experience deleted! ",
            className: "toast-success",
          },
          error: {
            render: "Failed to delete experience ",
            className: "toast-error",
          },
        }
      );

      fetchExperience(); // Refresh after delete
      console.log("Delete success - toast should have shown"); // Debug log
    } catch (err) {
      console.error("Error deleting experience:", err);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);
  return (
    <section className="px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom-3 text-white">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold">EXPERIENCE</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Showcase your previous internships or roles
        </p>
      </div>

      {loading ? (
        <ExperienceLoader count={loaderCount} />
      ) : (
        <div className=" grid gap-6 sm:grid-cols-2 mb-14">
          {experience.length > 0 ? (
            experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                data={exp}
                onDelete={() => handleDelete(exp.id)}
              />
            ))
          ) : (
            <div className="text-center col-span-2 text-gray-400">
              No experience added yet.
            </div>
          )}
        </div>
      )}

      <AddExperienceForm onAdd={fetchExperience} />
    </section>
  );
};

export default Experience;
