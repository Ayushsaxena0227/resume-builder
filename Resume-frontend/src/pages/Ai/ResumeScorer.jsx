import React, { useState, useEffect } from "react";
import { auth } from "../../Firebase/firebase";
import axios from "axios";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import { firebaseApp } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const ResumeScorer = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  useEffect(() => {
    const savedScore = localStorage.getItem("ai_resume_score");
    if (savedScore) {
      try {
        setScoreData(JSON.parse(savedScore));
      } catch {
        localStorage.removeItem("ai_resume_score");
      }
    }

    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const user = auth.currentUser;
      const token = await user.getIdToken();
      const res = await axios.get(`${baseURL}/api/user/${user.uid}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResume(res.data);
    } catch (err) {
      console.error("Failed to fetch resume:", err);
    }
  };

  const runScoring = async () => {
    if (!resume) return;
    setLoading(true);
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const prompt = `
        You are an expert resume reviewer. Given the following resume:

        ${JSON.stringify(resume)}

        Please evaluate and return a JSON object ONLY, like:

        {
          "score": 9,
          "badges": ["Well structured", "Strong content"],
          "categories": {
            "Formatting": 9,
            "Language": 8,
            "Experience Relevance": 7
          },
          "remarks": "Great overall resume. Minor improvements in language clarity suggested."
        }

        Output ONLY the raw JSON. Do NOT wrap it in markdown or explain it.
      `;

      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();

      // Strip ```json or ``` if present
      if (text.startsWith("```")) {
        text = text.replace(/```json\s*|```/g, "").trim();
      }

      const parsed = JSON.parse(text);

      setScoreData(parsed);
      localStorage.setItem("ai_resume_score", JSON.stringify(parsed));
      toast.success("AI Resume Score generated ");
    } catch (err) {
      console.error("Scoring error:", err);
      toast.error("Something went wrong. AI returned invalid format.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScoreData(null);
    localStorage.removeItem("ai_resume_score");
    toast.info("Score data reset. Analyze again!");
  };

  return (
    <div className="inline-block">
      <button
        onClick={runScoring}
        disabled={loading}
        className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
      >
        {loading ? "Scoring..." : " My Resume Score"}
      </button>

      {scoreData && (
        <div className="mt-6 p-6 bg-gray-900 rounded-lg text-white border border-purple-800 transition-all">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">My Resume Score</h3>
            <button
              onClick={handleReset}
              className="text-sm text-red-400 hover:text-red-300 underline"
            >
              🔄 Reset Score
            </button>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg border border-blue-500 text-purple-200 transition-all duration-300">
            <p className="text-2xl mb-2 font-semibold">
              Score: {scoreData.score}/10
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {scoreData.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-gray-700 px-3 py-1 text-sm rounded"
                >
                  {badge}
                </span>
              ))}
            </div>
            <ul className="text-sm text-purple-300 list-disc list-inside space-y-1">
              {Object.entries(scoreData.categories).map(([cat, val]) => (
                <li key={cat}>
                  <strong>{cat}:</strong> {val}/10
                </li>
              ))}
            </ul>
            <p className="mt-4 italic text-yellow-300">{scoreData.remarks}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScorer;
