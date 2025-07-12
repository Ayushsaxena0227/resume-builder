import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PersonalInfo from "./pages/Personalinfo";
import Skills from "./pages/skills";
import Projects from "./pages/Projects/Projects";
import { Education } from "./pages/Education/Education";
import Experience from "./pages/Experience/Experience";
import Achievements from "./pages/Achievment/Achievment";
import ResumePreview from "./pages/Resumepreview/Resumepreview";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import { useAuth } from "./context/Authcontext";
import ProtectedRoute from "./pages/Auth/ProtectedRoute";
import SmartAISuggestions from "./pages/Ai/Aikeywords";
import FeedbackDashboard from "./pages/Feedback/FeedbackDashboard";
import PublicResumeView from "./pages/PublicView/PublicResumeView";
import ResumeAnalytics from "./pages/Analytics/ResumeAnalytics";
import ResumeHistory from "./pages/ResumeVersions/ResumeHistory";

const App = () => {
  const { currentUser } = useAuth();

  return (
    <div className="flex bg-[#050414] min-h-screen">
      {currentUser && <Sidebar />}
      <div className={`${currentUser ? "" : ""} p-4 sm:p-6 md:p-8 w-full`}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={currentUser ? <Dashboard /> : <Login />} />

          <Route
            path="/personal-info"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-keywords"
            element={
              <ProtectedRoute>
                <SmartAISuggestions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <Skills />
              </ProtectedRoute>
            }
          />
          <Route
            path="/education"
            element={
              <ProtectedRoute>
                <Education />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/experience"
            element={
              <ProtectedRoute>
                <Experience />
              </ProtectedRoute>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedRoute>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-preview"
            element={
              <ProtectedRoute>
                <ResumePreview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-history"
            element={
              <ProtectedRoute>
                <ResumeHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feedbacks"
            element={
              <ProtectedRoute>
                <FeedbackDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/resume/shared/:userId" element={<PublicResumeView />} />
          <Route path="/analytics" element={<ResumeAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
