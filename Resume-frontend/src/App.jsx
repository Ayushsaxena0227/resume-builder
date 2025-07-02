import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PersonalInfo from "./pages/Personalinfo";
import Skills from "./pages/skills";

const Placeholder = ({ name }) => (
  <div className="text-xl font-semibold">{name} Page Coming Soon...</div>
);

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 p-8 w-full">
        <Routes>
          <Route path="/" element={<Placeholder name="Dashboard" />} />
          <Route path="/personal-info" element={<PersonalInfo />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<Placeholder name="Education" />} />
          <Route path="/projects" element={<Placeholder name="Projects" />} />
          <Route
            path="/experience"
            element={<Placeholder name="Experience" />}
          />
          <Route
            path="/achievements"
            element={<Placeholder name="Achievements" />}
          />
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
