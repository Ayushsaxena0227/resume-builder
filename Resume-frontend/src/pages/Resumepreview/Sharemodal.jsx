import { useState, useEffect } from "react";
import { auth } from "../../Firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";

const ShareModal = ({ isOpen, onClose }) => {
  const [shareUrl, setShareUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Listen to auth state changes to get the correct user ID
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Auth state changed - User ID:", user.uid);
        setCurrentUserId(user.uid);
      } else {
        console.log("Auth state changed - No user");
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto-generate link when modal opens and user is available
  useEffect(() => {
    if (isOpen && currentUserId && !shareUrl) {
      generateShareLink();
    }
  }, [isOpen, currentUserId]);

  const generateShareLink = async () => {
    setLoading(true);

    try {
      const user = auth.currentUser;
      const userId = user?.uid || currentUserId;

      console.log("Generating share link for user ID:", userId); // Existing

      if (!userId) {
        toast.error("❌ Please login to generate share link");
        return;
      }

      // NEW: Log before checking resume existence
      console.log(
        "Checking resume existence with ?owner=true (should NOT count view)"
      );

      // Test if the user's resume data exists (WITHOUT incrementing views)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_URL || "http://localhost:5000"
          }/api/user/resume/shared/${userId}?owner=true`
        );

        console.log("Resume check response status:", response.status); // NEW: Log status

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Resume fetch error:", errorData);
          // ... (rest of error handling unchanged)
          return;
        }

        const resumeData = await response.json();
        console.log(
          "Resume data check successful (no view should be counted):",
          resumeData
        );
      } catch (error) {
        console.error("Error checking resume data:", error);
        toast.warning(
          "⚠️ Couldn't verify resume data, but generating link anyway..."
        );
      }

      const link = `${window.location.origin}/resume/shared/${userId}`;
      setShareUrl(link);
      toast.success("🔗 Share link generated successfully!");

      // Auto-copy (unchanged)
    } catch (error) {
      // ... (unchanged)
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("📋 Copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand("copy");
        toast.success("📋 Copied to clipboard!");
      } catch (fallbackError) {
        toast.error("❌ Failed to copy to clipboard");
      }
      document.body.removeChild(textArea);
    }
  };

  const testShareLink = () => {
    if (shareUrl) {
      const ownerPreviewUrl = `${shareUrl}?owner=true`;
      console.log("Opening owner preview:", ownerPreviewUrl); // NEW: Log the URL to confirm param
      window.open(ownerPreviewUrl, "_blank");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg border border-purple-600 w-[90%] max-w-lg relative">
        <h2 className="text-xl font-semibold text-white mb-4">
          🔗 Share Your Resume
        </h2>

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-2 bg-gray-800 rounded text-xs text-gray-400">
            <div>Current User ID: {currentUserId || "Not loaded"}</div>
            <div>Auth User ID: {auth.currentUser?.uid || "Not available"}</div>
          </div>
        )}

        {!currentUserId ? (
          <div className="text-center text-gray-400 mb-4">
            <div className="animate-spin h-6 w-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
            Loading user information...
          </div>
        ) : shareUrl ? (
          <div className="space-y-3">
            <div className="bg-gray-800 text-purple-300 px-4 py-3 rounded border">
              <div className="text-sm font-medium mb-2">
                Your shareable resume link:
              </div>
              <div className="text-xs break-all text-gray-300">{shareUrl}</div>{" "}
              {/* Still shows public URL without params */}
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white text-sm font-medium transition-colors"
              >
                📋 Copy Link
              </button>
              <button
                onClick={testShareLink}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white text-sm font-medium transition-colors"
              >
                👁️ Preview
              </button>
            </div>

            <button
              onClick={() => {
                setShareUrl("");
                generateShareLink();
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm transition-colors"
              disabled={loading}
            >
              🔄 Regenerate Link
            </button>
          </div>
        ) : (
          <button
            onClick={generateShareLink}
            disabled={loading || !currentUserId}
            className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 text-white rounded-md transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating...
              </span>
            ) : (
              "Generate Share Link"
            )}
          </button>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl text-gray-400 hover:text-red-400 transition-colors"
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
