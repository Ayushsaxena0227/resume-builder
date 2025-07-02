import React, { useEffect, useState } from "react";
import { getPersonalInfo, updatePersonalInfo } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInfo = () => {
  const userId = "ayush123"; // later make this dynamic
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    address: "",
    summary: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const info = await getPersonalInfo(userId);
        setFormData(info);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePersonalInfo(userId, formData);
      toast.success("Personal info updated!");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <section className="py-16 px-[10vw] bg-skills-gradient min-h-screen font-sans">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        PERSONAL INFO
      </h2>
      <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>

      {loading ? (
        <div className="text-center text-white">Loading...</div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  Name:
                </span>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  Email:
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  Phone:
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  GitHub:
                </span>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="Enter your GitHub URL"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  LinkedIn:
                </span>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="Enter your LinkedIn URL"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  Address:
                </span>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-black text-lg font-semibold w-24">
                  Summary:
                </span>
                <input
                  type="text"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Enter your professional summary"
                  className="flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-md hover:opacity-90 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonalInfo;
