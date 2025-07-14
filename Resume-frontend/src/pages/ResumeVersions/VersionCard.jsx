import { useState } from "react";
import axios from "axios";
import { auth } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const VersionCard = ({ version, onRestore, index }) => {
  const [restoring, setRestoring] = useState(false);

  const handleRestore = async () => {
    try {
      setRestoring(true);
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `http://localhost:5000/api/user/resume/restore/${version.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(
        ` ${version.versionName || "Resume"} restored successfully!`
      );
      if (onRestore) onRestore();
    } catch (err) {
      console.error("Error restoring version:", err);
      toast.error(" Failed to restore version");
    } finally {
      setRestoring(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return "No Date";

      if (typeof dateString === "string" && dateString.includes("T")) {
        return new Date(dateString).toLocaleString();
      }

      if (typeof dateString === "number") {
        return new Date(dateString).toLocaleString();
      }

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Invalid Date";
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">
        {version.versionName || "Version"} {index}
      </h3>

      <p className="text-sm text-gray-400 mb-3">
        Created At: {formatDate(version.createdAt)}
      </p>

      <div className="text-sm text-gray-400 mb-4">
        <p>Skills: {version.data?.skills?.length || 0}</p>
        <p>Projects: {version.data?.projects?.length || 0}</p>
        <p>Experience: {version.data?.experience?.length || 0}</p>
        <p>Education: {version.data?.education?.length || 0}</p>
        <p>Achievements: {version.data?.achievements?.length || 0}</p>
      </div>

      <button
        onClick={handleRestore}
        disabled={restoring}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {restoring ? "Restoring..." : "Restore"}
      </button>
    </div>
  );
};

export default VersionCard;
