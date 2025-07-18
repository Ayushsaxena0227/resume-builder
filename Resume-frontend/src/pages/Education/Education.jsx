import React, { useEffect, useState } from "react";
import AddEducationForm from "./AddeducationForm";
import EducationCard from "./EducationCard";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../Firebase/firebase";

const EducationLoader = ({ count = 3 }) => {
  return (
    <div className="grid gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="border border-gray-700 rounded-lg p-6 bg-[#1a1a2e]"
        >
          <div className="h-6 bg-gray-600 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  );
};

export const Education = () => {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCount, setLoadingCount] = useState(3);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const fetchEducation = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();

      const res = await axios.get(`${baseURL}/api/user/${user.uid}/education`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEducation(res.data || []);
      setLoadingCount(res.data?.length > 0 ? res.data.length : 3);
    } catch (error) {
      toast.error("No Education Added yet");
      console.error("Failed to fetch education:", error);
      setLoadingCount(3);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Unauthorized request");
      return;
    }

    try {
      const token = await user.getIdToken();

      await axios.delete(`${baseURL}/api/user/${user.uid}/education/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Education Deleted");
      fetchEducation();
    } catch (error) {
      toast.error("Failed to Delete Education");
      console.error("Failed to delete:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchEducation();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   fetchEducation();
  // }, []);

  return (
    <section className=" px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom-3 text-white">
      <div className="text-center mb-12">
        <ToastContainer />
        <h2 className="text-4xl font-bold">EDUCATION</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Track your academic qualifications and achievements
        </p>
      </div>

      <div className="mt-8 mb-10 grid gap-6">
        {loading ? (
          <EducationLoader count={loadingCount} />
        ) : education.length > 0 ? (
          education.map((edu) => (
            <EducationCard
              key={edu.id}
              {...edu}
              onDelete={() => handleDelete(edu.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-400 text-lg">
            No education entries found.
          </div>
        )}
      </div>

      {!loading && <AddEducationForm onSuccess={fetchEducation} />}
    </section>
  );
};
