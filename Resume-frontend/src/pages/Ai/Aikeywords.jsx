import { useState, useEffect } from "react";
import { firebaseApp, auth } from "../../Firebase/firebase";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobDescriptionAnalyzer from "./JobdescriptionAnalyzer";
import roles from "../../Constants/roles";
import Select from "react-select";

const SmartAISuggestions = () => {
  const [role, setRole] = useState("");
  const [resume, setResume] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [generatedSummary, setGeneratedSummary] = useState("");
  const [resumeLoading, setResumeLoading] = useState(false);
  const [keywordLoading, setKeywordLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [savingSummary, setSavingSummary] = useState(false);
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const roleOptions = roles.map((r) => ({ value: r, label: r }));

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
          `${baseURL}/api/user/${userId}/resume`,
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
      toast.success("summary generated successfully");
      localStorage.setItem("ai_summary", newSummary);
    } catch (err) {
      toast.error("Summary generation failed ");
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
        `${baseURL}/api/user/personal`,
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
              `${baseURL}${endpoint}`,
              { name: kw },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
        );
      } else {
        const summary = resume?.personalInfo?.summary || "";
        const newSummary = `${summary} ${keywords.join(", ")}`;
        await axios.post(
          `${baseURL}${endpoint}`,
          { ...resume.personalInfo, summary: newSummary },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success(` Added to ${section}`);
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
    <section className=" py-20 bg-skills-gradient text-white min-h-screen">
      <ToastContainer />
      {(keywordLoading || summaryLoading) && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center pl-12 sm:pl-0 items-center">
          <div className="flex items-center gap-3 bg-[#1f1a40] px-6 py-4 rounded-lg border border-purple-700 shadow-lg">
            <svg
              className="animate-spin h-6 w-6 text-purple-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="text-white font-medium whitespace-nowrap">
              AI is generating content...
            </span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center mr-">
          🤖 Smart AI Resume Assistant
        </h1>

        <div className="bg-[#0d081f] border border-purple-500 p-6 rounded-lg max-w-xl mx-auto w-full">
          <Select
            value={roleOptions.find((option) => option.value === role)}
            onChange={(selected) => setRole(selected ? selected.value : "")}
            options={roleOptions}
            placeholder="Select a Role"
            isSearchable={true}
            menuPlacement="bottom"
            className="mb-4"
            classNamePrefix="select"
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#131025",
                border: "1px solid #4b5563",
                color: "white",
                borderRadius: "0.375rem",
                padding: "0.75rem",
                cursor: "pointer",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#131025",
                color: "white",
                border: "1px solid #4b5563",
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected ? "#4b5563" : "#131025",
                color: "white",
                "&:hover": { backgroundColor: "#4b5563" },
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              input: (base) => ({
                ...base,
                color: "white",
              }),
            }}
          />

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
            {summaryLoading
              ? "Thinking..."
              : "✨ Generate Professional Summary"}
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

          {(keywords.length > 0 || generatedSummary) && (
            <button
              onClick={resetAI}
              className="mt-6 bg-red-600 px-5 py-2 rounded hover:bg-red-500 w-full"
            >
              🔄 Reset AI Data
            </button>
          )}

          <div className="mt-24">
            <JobDescriptionAnalyzer />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartAISuggestions;
