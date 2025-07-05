import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../Firebase/firebase";

const AddEducationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    degree: "",
    institute: "",
    startYear: "",
    endYear: "",
    score: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      toast.error("You must be logged in to add education.");
      return;
    }

    try {
      const token = await user.getIdToken();

      await axios.post(
        `http://localhost:5000/api/user/${user.uid}/education`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFormData({
        degree: "",
        institute: "",
        startYear: "",
        endYear: "",
        score: "",
      });
      toast.success("Education added!");
      onSuccess();
    } catch (error) {
      toast.error("Error adding Education");
      console.error("Error adding education:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d081f] p-6 rounded-lg shadow-lg border border-gray-700 space-y-4 max-w-xl mx-auto"
    >
      <div className="flex flex-col gap-2 text-black">
        <ToastContainer />
        <input
          type="text"
          name="degree"
          value={formData.degree}
          onChange={handleChange}
          placeholder="Degree"
          className="form-input"
          required
        />
        <input
          type="text"
          name="institute"
          value={formData.institute}
          onChange={handleChange}
          placeholder="Institute"
          className="form-input"
          required
        />
        <input
          type="text"
          name="startYear"
          value={formData.startYear}
          onChange={handleChange}
          placeholder="Start Year"
          className="form-input"
          required
        />
        <input
          type="text"
          name="endYear"
          value={formData.endYear}
          onChange={handleChange}
          placeholder="End Year"
          className="form-input"
          required
        />
        <input
          type="text"
          name="score"
          value={formData.score}
          onChange={handleChange}
          placeholder="Score"
          className="form-input"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition"
      >
        Add Education
      </button>
    </form>
  );
};

export default AddEducationForm;
