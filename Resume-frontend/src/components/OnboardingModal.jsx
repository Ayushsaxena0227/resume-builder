import React, { useEffect } from "react";
import Modal from "react-modal";

const OnboardingModal = ({ isOpen, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Lock body scroll
    } else {
      document.body.style.overflow = "auto"; // Unlock
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="bg-[#1a1a2e] p-6 rounded-xl shadow-2xl border border-gray-700 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto relative" // Tailwind: Sized, scrollable, centered
      overlayClassName="fixed inset-0 bg-black/75 flex items-center justify-center z-50" // Tailwind: Dark overlay, full-screen but flexible
      contentLabel="Onboarding Tour"
    >
      {/* Visible Cross Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-purple-400 transition duration-200"
        aria-label="Close modal"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Welcome to Resume Builder!
      </h2>
      <p className="text-gray-300 mb-6 text-center">
        Here's a quick guide to our powerful AI features to help you build an
        amazing resume.
      </p>

      <div className="space-y-4">
        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            1. Role-Based AI Suggestions
          </h3>
          <p className="text-gray-300">
            Select a job role (e.g., UI/UX Designer or Java Developer) to get
            AI-generated keywords, skills, and a professional summary tailored
            to that role.
          </p>
        </div>

        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            2. Job Description (JD) Analyzer
          </h3>
          <p className="text-gray-300">
            Paste a job description, and our AI will analyze your resume,
            provide feedback on each section, and suggest improvements to match
            the JD.
          </p>
        </div>

        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            3. Resume Scoring & Optimization
          </h3>
          <p className="text-gray-300">
            Get an AI-powered score for your resume with tips to improve it,
            including keyword optimization and content suggestions.
          </p>
        </div>

        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            4. Sharing & Feedback
          </h3>
          <p className="text-gray-300">
            Share your resume via a unique link – recipients can view and submit
            feedback, which you can track in your feedback dashboard.
          </p>
        </div>

        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            5. Version Control
          </h3>
          <p className="text-gray-300">
            Save multiple resume versions with names, timestamps, and AI-powered
            comparisons/diffs to see changes easily.
          </p>
        </div>

        <div className="p-4 bg-[#131025] rounded-lg">
          <h3 className="text-lg font-semibold text-white">
            6. Resume Analytics
          </h3>
          <p className="text-gray-300">
            Track views, feedback counts, last viewed time, and more –
            visualized in charts for insights on your resume's performance.
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 w-full py-3 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-semibold"
      >
        Got It! Start Building
      </button>
    </Modal>
  );
};

export default OnboardingModal;
