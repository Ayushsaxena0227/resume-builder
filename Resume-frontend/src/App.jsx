import { Routes, Route, useNavigate } from "react-router-dom";
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

const App = () => {
  const { currentUser } = useAuth();
  // console.log(currentUser);

  return (
    <div className="flex bg-[#050414]">
      {currentUser && <Sidebar />}
      <div className={`${currentUser ? "ml-64" : ""} p-8 w-full`}>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={currentUser ? <Dashboard /> : <Login />} />

          {/* Protect all these routes */}
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
        </Routes>
      </div>
    </div>
  );
};
export default App;
