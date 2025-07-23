import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase";
import axios from "axios";
import { toast } from "react-toastify";
import FeedbackCard from "./FeedbackCard";

const FeedbackDashboardLoader = ({ count = 4 }) => (
  <div className="space-y-6 animate-pulse text-white">
    {[...Array(count)].map((_, index) => (
      <div
        key={index}
        className="bg-[#1a1a2e] border border-gray-700 rounded-lg p-6"
      >
        <div className="h-5 bg-gray-600 rounded w-1/3 mb-4"></div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        </div>

        <div className="mt-4 flex gap-3">
          <div className="h-4 bg-gray-600 rounded w-20"></div>
          <div className="h-4 bg-gray-600 rounded w-24"></div>
        </div>
      </div>
    ))}
  </div>
);

const FeedbackDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFeedback = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await axios.get(`${baseURL}/api/user/resume/feedbacks`, {
          // Removed trailing /
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFeedbackList(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        toast.error("Failed to load feedbacks.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="px-[6vw] lg:px-[10vw] py-10">
      <h1 className="text-2xl font-bold text-white mb-6">
        📥 Feedback Dashboard
      </h1>

      {loading ? (
        <FeedbackDashboardLoader count={feedbackList.length || 4} />
      ) : feedbackList.length === 0 ? (
        <p className="text-gray-400">No feedback submitted yet.</p>
      ) : (
        <div className="grid gap-6 mr-6">
          {feedbackList.map((item) => (
            <FeedbackCard key={item.id} feedback={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackDashboard;
