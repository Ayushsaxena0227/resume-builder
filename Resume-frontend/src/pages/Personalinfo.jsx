import React, { useEffect, useState } from "react";
import { getPersonalInfo, updatePersonalInfo } from "../services/userService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/Authcontext";
// Personal Info Loader Component
const PersonalInfoLoader = () => {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="flex flex-col gap-6">
        {[
          "Name",
          "Email",
          "Phone",
          "GitHub",
          "LinkedIn",
          "Address",
          "Summary",
        ].map((field, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="w-24">
                <div className="h-6 bg-gray-600 rounded w-3/4"></div>
              </div>
              <div className="flex-1">
                <div className="h-10 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-6">
          <div className="h-10 bg-gray-600 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

const PersonalInfo = () => {
  const { currentUser } = useAuth();
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
      if (!currentUser) return;

      try {
        const token = await currentUser.getIdToken();
        const info = await getPersonalInfo(currentUser.uid, token); // ✅ Dynamic
        setFormData(info);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load personal info");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const token = await currentUser.getIdToken(); // ✅ Get fresh token
      await updatePersonalInfo(currentUser.uid, formData, token); // ✅ Dynamic
      toast.success("Personal info updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update info");
    }
  };

  return (
    <section className="px-[10vw] bg-skills-gradient min-h-screen font-sans">
      <ToastContainer />
      <h2 className="text-4xl font-bold text-white text-center mb-10">
        PERSONAL INFO
      </h2>
      <div className="w-24 h-1 bg-purple-500 mx-auto mb-6"></div>

      {loading ? (
        <PersonalInfoLoader />
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
                <span className="text-white text-lg font-semibold w-24">
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
