import React, { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  AiOutlineEye,
  AiOutlineCalendar,
  AiOutlineFileText,
} from "react-icons/ai";

// Resume Analytics Loader (Skeleton)
const ResumeAnalyticsLoader = () => (
  <div className="text-white space-y-12 animate-pulse">
    {/* Title Placeholder */}
    <div className="h-10 bg-gray-700 w-1/3 rounded mx-auto"></div>

    {/* Cards Placeholder */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="bg-gradient-to-br from-[#1f1a40] to-[#1a1f2e] rounded-xl p-6 border border-purple-700 shadow-lg"
        >
          <div className="h-6 bg-gray-600 w-1/2 rounded mb-6"></div>
          <div className="space-y-3 text-sm">
            <div className="h-4 bg-gray-700 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-700 w-2/3 rounded"></div>
            <div className="h-4 bg-gray-700 w-1/2 rounded"></div>
          </div>
          <div className="h-4 bg-blue-700 rounded w-3/4 mt-6"></div>
        </div>
      ))}
    </div>

    {/* Chart Placeholder */}
    <div className="mt-16 rounded-xl bg-gray-900 p-8 border border-purple-800 shadow-inner">
      <div className="h-6 bg-gray-600 w-1/4 rounded mb-6"></div>
      <div className="h-64 bg-gray-800 rounded"></div>
    </div>
  </div>
);

const ResumeAnalytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const fetchAnalytics = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const response = await axios.get(`${baseURL}/api/user/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return (
    <section className="min-h-screen px-[10vw] py-16 bg-[#0d081f] text-white">
      <h1 className="text-4xl font-bold mb-10 border-b border-purple-600 pb-4">
        📈 Resume Analytics
      </h1>

      {loading ? (
        <ResumeAnalyticsLoader />
      ) : analytics.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No analytics data available yet.
        </p>
      ) : (
        <>
          {/* Resume Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {analytics.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#1f1a40] to-[#1a1f2e] rounded-xl p-6 border border-purple-700 shadow-lg hover:scale-[1.02] transition"
              >
                <h2 className="text-2xl font-semibold text-purple-400 mb-3">
                  Resume #{index + 1}
                </h2>

                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <AiOutlineEye className="text-blue-400" />
                    <span>Views: </span>
                    <span className="font-semibold text-white">
                      {item.views || 0}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <AiOutlineFileText className="text-green-400" />
                    <span>Feedbacks: </span>
                    <span className="font-semibold text-white">
                      {item.feedbackCount || 0}
                    </span>
                  </p>

                  <p className="flex items-center gap-2">
                    <AiOutlineCalendar className="text-yellow-400" />
                    <span>Last Viewed: </span>
                    <span className="text-gray-300 italic">
                      {item.lastViewed
                        ? new Date(item.lastViewed).toLocaleString()
                        : "Never"}
                    </span>
                  </p>
                </div>

                <a
                  href={`/resume/shared/${item.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-blue-400 underline"
                >
                  🔗 Open Shared Resume
                </a>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="mt-16 rounded-xl bg-gray-900 p-8 shadow-inner border border-purple-800">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              🧠 Visual Overview (Chart)
            </h2>

            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis
                  tickFormatter={(_, index) => `Resume ${index + 1}`}
                  tick={{ fill: "#ccc" }}
                />
                <YAxis tick={{ fill: "#ccc" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #6944ff",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "14px",
                  }}
                  labelStyle={{ color: "#f2f2f2" }}
                  itemStyle={{ color: "#f2f2f2" }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                />
                <Bar dataKey="views" fill="#8b5cf6" name="👁️ Views" />
                <Bar
                  dataKey="feedbackCount"
                  fill="#34d399"
                  name="📝 Feedbacks"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </section>
  );
};

export default ResumeAnalytics;
