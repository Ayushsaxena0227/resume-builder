import React, { useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase";

const AddAchievementForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    date: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      console.warn("User is not logged in");
      return;
    }

    try {
      const token = await user.getIdToken();
      const userId = user.uid;

      await axios.post(
        `http://localhost:5000/api/user/${userId}/achievements`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        title: "",
        type: "",
        date: "",
        description: "",
      });

      onAdd();
    } catch (err) {
      console.error("Error adding achievement:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d081f] p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto space-y-4 shadow-md"
    >
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="text"
        placeholder="Type (e.g. Certification, Award)"
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        className="form-input"
        required
      />
      <input
        type="date"
        placeholder="Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
        Add Achievement
      </button>
    </form>
  );
};

export default AddAchievementForm;
