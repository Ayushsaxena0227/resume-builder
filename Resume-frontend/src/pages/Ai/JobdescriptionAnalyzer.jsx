import { useEffect, useState } from "react";
import { firebaseApp, auth } from "../../Firebase/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import axios from "axios";
import { toast } from "react-toastify";
import ResumeScorer from "./ResumeScorer";

const JobDescriptionAnalyzer = () => {
  const [jobDesc, setJobDesc] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  useEffect(() => {
    const savedDesc = localStorage.getItem("jd_desc");
    const savedAnalysis = localStorage.getItem("jd_feedback");

    if (savedDesc) setJobDesc(savedDesc);
    if (savedAnalysis) setAnalysis(savedAnalysis);
  }, []);

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) {
      toast.warn("Paste a job description first");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast.error("User not logged in");
      return;
    }

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const userId = user.uid;

      const res = await axios.get(`${baseURL}/api/user/${userId}/resume`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resume = res.data;

      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const prompt = `
        You are a resume reviewer AI.
        Analyze this resume: ${JSON.stringify(resume)}
        Compare with this job description: ${jobDesc}
        Provide:
        - Resume strengths
        - Areas that need improvement
        - Missing skills
        - Feedback with bullets or pointed paragraphs
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      setAnalysis(responseText);
      localStorage.setItem("jd_desc", jobDesc);
      localStorage.setItem("jd_feedback", responseText);
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysis) {
      toast.info("No feedback to copy");
      return;
    }

    navigator.clipboard.writeText(analysis);
    toast.success("Copied AI Suggestions ✅");
  };

  const handleReset = () => {
    setJobDesc("");
    setAnalysis("");
    localStorage.removeItem("jd_desc");
    localStorage.removeItem("jd_feedback");
    toast.info("Analyzer reset. Start fresh!");
  };

  return (
    <div className="w-full bg-gray-900 border border-purple-600 rounded-lg p-6 transition-all">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        📄 Job Description Analyzer
      </h2>

      <textarea
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        placeholder="Paste your job description here..."
        className="w-full h-40 p-4 text-white bg-gray-800 border border-gray-600 rounded-md resize-none mb-4 text-sm"
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-md font-medium w-full"
      >
        {loading ? "Thinking..." : "🔍 Analyze My Resume"}
      </button>

      {analysis && (
        <div className="mt-6 bg-gray-800 p-5 border border-blue-500 rounded-lg text-purple-200 whitespace-pre-wrap leading-relaxed">
          {analysis}

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={handleCopy}
              className="bg-purple-600 hover:bg-purple-500 px-4 py-2 text-white rounded-md text-sm"
            >
              📋 Copy Feedback
            </button>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-500 px-4 py-2 text-white rounded-md text-sm"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescriptionAnalyzer;
