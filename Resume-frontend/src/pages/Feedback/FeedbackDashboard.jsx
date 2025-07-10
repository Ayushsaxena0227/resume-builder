import { useEffect, useState } from "react";
import { auth } from "../../Firebase/firebase";
import axios from "axios";
import FeedbackCard from "./FeedbackCard";

const FeedbackDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await axios.get(
          `http://localhost:5000/api/user/resume/feedbacks/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFeedbackList(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
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
        <p className="text-gray-300">Loading feedback...</p>
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
