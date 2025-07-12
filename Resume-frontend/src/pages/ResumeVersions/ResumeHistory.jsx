import { useEffect, useState } from "react";
import axios from "axios";
import VersionCard from "./VersionCard";
import { auth } from "../../Firebase/firebase";

const ResumeHistory = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchVersions = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(
        "http://localhost:5000/api/user/resume/versions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // console.log("Raw response:", res.data);
      res.data.forEach((version, index) => {
        console.log(`Version ${index}:`, {
          id: version.id,
          createdAt: version.createdAt,
          createdAtType: typeof version.createdAt,
        });
      });

      setVersions(res.data);
    } catch (err) {
      console.error("Failed to fetch resume versions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);
  const saveVersion = async () => {
    try {
      setSaving(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.post(
        "http://localhost:5000/api/user/resume/save-version",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Use the message from backend or default
      alert(response.data.message || "✅ Resume version saved!");
      fetchVersions(); // Refresh version list
    } catch (err) {
      console.error("Error saving version:", err);
      alert("❌ Failed to save version");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-10 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📋 Resume Version History</h1>

      <button
        onClick={saveVersion}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 mb-8 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "💾 Save Current Resume Version"}
      </button>

      {loading ? (
        <p className="text-gray-400">Loading versions...</p>
      ) : versions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {versions.map((ver, index) => (
            <VersionCard
              key={ver.id}
              version={ver}
              index={index}
              onRestore={fetchVersions}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No resume versions found yet.</p>
      )}
    </section>
  );
};

export default ResumeHistory;
