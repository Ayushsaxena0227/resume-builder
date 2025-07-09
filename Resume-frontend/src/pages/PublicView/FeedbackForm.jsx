import { useState } from "react";
import axios from "axios";

const FeedbackForm = ({ userId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInput = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `http://localhost:5000/api/user/resume/feedback/${userId}`,
        feedback
      );
      setSubmitted(true);
      setFeedback({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Feedback submit error", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 rounded p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4 text-white">
        📩 Leave Feedback
      </h2>
      {submitted && (
        <p className="text-green-400 mb-4">✅ Thanks for your feedback!</p>
      )}

      <input
        name="name"
        value={feedback.name}
        onChange={handleInput}
        placeholder="Your Name"
        required
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />

      <input
        type="email"
        name="email"
        value={feedback.email}
        onChange={handleInput}
        placeholder="Your Email"
        required
        className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
      />

      <textarea
        name="message"
        value={feedback.message}
        onChange={handleInput}
        placeholder="Your Feedback"
        required
        className="w-full p-3 mb-4 rounded bg-gray-700 text-white resize-none"
      />

      <button
        type="submit"
        className="bg-purple-600 px-4 py-2 rounded text-white"
      >
        Submit Feedback
      </button>
    </form>
  );
};

export default FeedbackForm;
