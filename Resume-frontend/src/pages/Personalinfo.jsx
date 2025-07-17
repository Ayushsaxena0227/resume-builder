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
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        const token = await currentUser.getIdToken();
        const info = await getPersonalInfo(currentUser.uid, token);
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
      const token = await currentUser.getIdToken();
      await updatePersonalInfo(currentUser.uid, formData, token);
      toast.success("Personal info updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update info");
    }
  };

  return (
    <section className=" bg-skills-gradient min-h-screen font-sans">
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
            {[
              {
                label: "Name",
                name: "fullName",
                type: "text",
                placeholder: "Enter your full name",
              },
              {
                label: "Email",
                name: "email",
                type: "email",
                placeholder: "Enter your email",
              },
              {
                label: "Phone",
                name: "phone",
                type: "tel",
                placeholder: "Enter your phone number",
              },
              {
                label: "GitHub",
                name: "github",
                type: "url",
                placeholder: "Enter your GitHub URL",
              },
              {
                label: "LinkedIn",
                name: "linkedin",
                type: "url",
                placeholder: "Enter your LinkedIn URL",
              },
              {
                label: "Address",
                name: "address",
                type: "text",
                placeholder: "Enter your address",
              },
            ].map((field, idx) => (
              <div className="flex flex-col gap-2" key={idx}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-white text-lg font-semibold w-full sm:w-24">
                    {field.label}:
                  </span>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full sm:flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-white text-lg font-semibold w-full sm:w-24 pt-1">
                  Summary:
                </span>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  placeholder="Enter your professional summary"
                  rows={4}
                  className="w-full sm:flex-1 px-4 py-2 rounded-md bg-[#131025] text-white border border-gray-600 focus:outline-none focus:border-purple-500"
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
