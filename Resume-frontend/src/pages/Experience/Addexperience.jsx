import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { auth } from "../../Firebase/firebase";

const AddExperienceForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      console.warn("You must be logged in to add experience.");
      return;
    }

    try {
      const token = await user.getIdToken();
      const userId = user.uid;

      // toast.promise with custom class
      await toast.promise(
        axios.post(`${baseURL}/api/user/${userId}/experience`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        {
          pending: "Adding experience...",
          success: {
            render: "Experience added! 🎉",
            className: "toast-success",
          },
          error: {
            render: "Error adding experience 😞",
            className: "toast-error",
          },
        }
      );

      setFormData({
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
      onAdd();
      console.log("Add success - toast should have shown");
    } catch (err) {
      console.error("Error adding experience:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d081f] p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto space-y-4 shadow-lg"
    >
      <input
        type="text"
        placeholder="Role"
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="text"
        placeholder="Company"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="date"
        placeholder="Start Date"
        value={formData.startDate}
        onChange={(e) =>
          setFormData({ ...formData, startDate: e.target.value })
        }
        className="form-input"
        required
      />
      <input
        type="date"
        placeholder="End Date"
        value={formData.endDate}
        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
        className="form-input"
        required
      />
      <textarea
        placeholder="Description"
        rows="3"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        className="form-input"
        required
      />
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition"
      >
        Add Experience
      </button>
    </form>
  );
};

export default AddExperienceForm;
