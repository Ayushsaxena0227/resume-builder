import { useState, useEffect } from "react";
import { firebaseApp, auth } from "../../Firebase/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "UI/UX Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
];

const SmartAISuggestions = () => {
  const [role, setRole] = useState("");
  const [resume, setResume] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);

  useEffect(() => {
    const savedKeywords = localStorage.getItem("ai_keywords");
    const savedSummary = localStorage.getItem("ai_summary");

    if (savedKeywords) setKeywords(JSON.parse(savedKeywords));
    if (savedSummary) setGeneratedSummary(savedSummary);
  }, []);

  useEffect(() => {
    const fetchResume = async () => {
      setResumeLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const token = await user.getIdToken();
        const userId = user.uid;

        const response = await axios.get(
          `http://localhost:5000/api/user/${userId}/resume`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setResume(response.data);
      } catch (error) {
        console.error("Resume fetch error:", error);
        toast.error("Failed to load resume");
      } finally {
        setResumeLoading(false);
      }
    };

    fetchResume();
  }, []);

  const runAI = async () => {
    if (!role || !resume) return;
    setKeywordLoading(true);
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const prompt = `
        You are a resume optimization expert.
        Based on this resume: ${JSON.stringify(resume)}
        Suggest 10 powerful resume keywords relevant for the role of: "${role}".
        Return them as a comma-separated list only.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const keywordList = responseText
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      setKeywords(keywordList);
      localStorage.setItem("ai_keywords", JSON.stringify(keywordList));
      toast.success("AI Suggestions Ready ✅");
    } catch (error) {
      toast.error("Failed to generate keywords");
      console.error(error);
    } finally {
      setKeywordLoading(false);
    }
  };

  const generateProfessionalSummary = async () => {
    if (!role || !resume) return;
    setSummaryLoading(true);
    try {
      const ai = getAI(firebaseApp, { backend: new GoogleAIBackend() });
      const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

      const prompt = `
        You are a professional career coach and resume writer.
        Based on the following resume data:
        ${JSON.stringify(resume)}
        and for the job role: "${role}",
        write a 3-4 line professional summary paragraph highlighting skills & strengths.
      `;

      const result = await model.generateContent(prompt);
      const newSummary = result.response.text().trim();

      setGeneratedSummary(newSummary);
      localStorage.setItem("ai_summary", newSummary);
    } catch (err) {
      toast.error("Summary generation failed ❌");
      console.error(err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const saveSummaryToBackend = async () => {
    if (!generatedSummary || !resume) return;
    setSavingSummary(true);
    try {
      const token = await auth.currentUser.getIdToken();

      await axios.post(
        `http://localhost:5000/api/user/personal`,
        {
          ...resume?.personalInfo,
          summary: generatedSummary,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResume((prev) => ({
        ...prev,
        personalInfo: { ...prev?.personalInfo, summary: generatedSummary },
      }));

      toast.success("Summary saved ✅");
      localStorage.removeItem("ai_summary");
    } catch (err) {
      console.error("Save error:", err);
      toast.error("Error saving summary");
    } finally {
      setSavingSummary(false);
    }
  };

  const copyToClipboard = () => {
    if (!keywords.length) return;
    navigator.clipboard.writeText(keywords.join(", "));
    toast.success("Copied to clipboard!");
  };

  const addToSection = async (section) => {
    if (!keywords.length) return;
    try {
      const token = await auth.currentUser.getIdToken();
      const endpoint =
        section === "skills" ? "/api/user/skills" : "/api/user/personal";

      if (section === "skills") {
        await Promise.all(
          keywords.map((kw) =>
            axios.post(
              `http://localhost:5000${endpoint}`,
              { name: kw },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      } else {
        const summary = resume?.personalInfo?.summary || "";
        const newSummary = `${summary} ${keywords.join(", ")}`;
        await axios.post(
          `http://localhost:5000${endpoint}`,
          { ...resume.personalInfo, summary: newSummary },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(`✅ Added to ${section}`);
    } catch (err) {
      console.error(err);
      toast.error("Error updating section");
    }
  };

  const resetAI = () => {
    setKeywords([]);
    setGeneratedSummary("");
    localStorage.removeItem("ai_keywords");
    localStorage.removeItem("ai_summary");
    toast.info("AI data reset");
  };

  return (
    <section className="px-[14vw] py-44 mb-16 bg-skills-gradient text-white">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">🤖 Smart AI Resume Assistant</h1>

      <div className="bg-[#0d081f] border border-purple-500 p-6 rounded-lg">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 mb-4"
        >
          <option value="">Select a Role</option>
          {roles.map((r, idx) => (
            <option key={idx} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={runAI}
          disabled={keywordLoading}
          className="bg-purple-700 px-6 py-2 rounded text-white hover:opacity-90 w-full mb-4"
        >
          {keywordLoading ? "Generating..." : "🔍 Get AI Keyword Suggestions"}
        </button>

        <button
          onClick={generateProfessionalSummary}
          disabled={summaryLoading}
          className="bg-blue-600 px-6 py-2 rounded text-white hover:opacity-90 w-full"
        >
          {summaryLoading ? "Thinking..." : "✨ Generate Professional Summary"}
        </button>

        {keywords.length > 0 && (
          <div className="mt-6">
            <h3 className="text-purple-200 font-semibold">AI Keywords:</h3>
            <ul className="list-disc list-inside text-purple-300 mt-2 space-y-1">
              {keywords.map((k, idx) => (
                <li key={idx}>{k}</li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
              >
                📋 Copy Keywords
              </button>
              <button
                onClick={() => addToSection("skills")}
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-500"
              >
                ➕ Add to Skills
              </button>
              <button
                onClick={() => addToSection("summary")}
                className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-500"
              >
                ⚠️ Add to Summary (Legacy)
              </button>
            </div>
          </div>
        )}

        {generatedSummary && (
          <div className="mt-10 bg-gray-800 p-5 rounded-lg border border-purple-600">
            <h3 className="text-white text-lg font-semibold mb-2">
              🧠 AI-Generated Professional Summary:
            </h3>
            <p className="text-purple-300 whitespace-pre-line">
              {generatedSummary}
            </p>

            <button
              onClick={saveSummaryToBackend}
              disabled={savingSummary}
              className="mt-4 bg-green-600 px-5 py-2 rounded hover:bg-green-500"
            >
              {savingSummary ? "Saving..." : "💾 Save This Summary"}
            </button>
          </div>
        )}

        {keywords.length > 0 || generatedSummary ? (
          <button
            onClick={resetAI}
            className="mt-6 bg-red-600 px-5 py-2 rounded hover:bg-red-500 w-full"
          >
            🔄 Reset AI Data
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default SmartAISuggestions;
