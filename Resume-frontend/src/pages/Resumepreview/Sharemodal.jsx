import { useState } from "react";
import { auth } from "../../Firebase/firebase";
import { toast } from "react-toastify";

const ShareModal = ({ isOpen, onClose }) => {
  const [shareUrl, setShareUrl] = useState("");

  const generateShareLink = () => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const link = `${window.location.origin}/resume/shared/${userId}`;
      setShareUrl(link);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg border border-purple-600 w-[90%] max-w-lg relative">
        <h2 className="text-xl font-semibold text-white mb-4">
          🔗 Share Your Resume
        </h2>

        {shareUrl ? (
          <div className="bg-gray-800 text-purple-300 px-4 py-2 rounded mb-4 flex justify-between items-center">
            <span className="text-sm truncate">{shareUrl}</span>
            <button
              className="ml-4 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm"
              onClick={() =>
                navigator.clipboard
                  .writeText(shareUrl)
                  .then(() => toast.success("🔗 Link copied!"))
                  .catch(() => toast.error("Failed to copy link 😞"))
              }
            >
              📋 Copy
            </button>
          </div>
        ) : (
          <button
            onClick={generateShareLink}
            className="bg-purple-600 hover:bg-purple-500 px-4 py-2 text-white rounded-md"
          >
            Generate Link
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-sm text-gray-400 hover:text-red-400"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
