import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PersonalInfo from "./pages/Personalinfo";
import Skills from "./pages/skills";
import Projects from "./pages/Projects/Projects";
import { Education } from "./pages/Education/Education";
import Experience from "./pages/Experience/Experience";
import Achievements from "./pages/Achievment/Achievment";

const Placeholder = ({ name }) => (
  <div className="text-xl font-semibold">{name} Page Coming Soon...</div>
);

const App = () => {
  return (
    <div className="flex bg-[#050414]">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <Routes>
          <Route path="/" element={<Placeholder name="Dashboard" />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Education />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route
            path="/resume-preview"
            element={<Placeholder name="Resume Preview" />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
