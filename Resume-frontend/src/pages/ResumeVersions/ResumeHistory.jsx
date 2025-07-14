import { useEffect, useState } from "react";
import axios from "axios";
import VersionCard from "./VersionCard";
import { auth } from "../../Firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ResumeVersionLoader = ({ count = 2 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-800 border border-gray-700 rounded-lg p-4"
        >
          <div className="h-6 bg-gray-600 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-10/12 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3 mb-4"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};

const ResumeHistory = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const baseURL = import.meta.env.VITE_URL;

  const fetchVersions = async () => {
    try {
      const token = await auth.currentUser.getIdToken();
      const res = await axios.get(`${baseURL}/api/user/resume/versions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // res.data.forEach((version, index) => {
      //   console.log(`Version ${index}:`, {
      //     id: version.id,
      //     createdAt: version.createdAt,
      //     createdAtType: typeof version.createdAt,
      //   });
      // });

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
        `${baseURL}/api/user/resume/save-version`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("resume saved");
      fetchVersions();
    } catch (err) {
      console.error("Error saving version:", err);
      toast.error("Failed to save version");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="p-10 text-white min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">📋 Resume Version History</h1>

      <button
        onClick={saveVersion}
        disabled={saving}
        className="bg-blue-600 text-white px-4 py-2 mb-8 rounded hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : "💾 Save Current Resume Version"}
      </button>
      {loading ? (
        <ResumeVersionLoader count={4} />
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
