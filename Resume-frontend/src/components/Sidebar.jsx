import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const links = [
    { label: "AI Assistant", path: "/ai-keywords" },
    { label: "Dashboard", path: "/" },
    { label: "Personal Info", path: "/personal-info" },
    { label: "Skills", path: "/skills" },
    { label: "Education", path: "/education" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "Achievements", path: "/achievements" },
    { label: "Resume Preview", path: "/resume-preview" },
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-700 text-white p-5 fixed ">
      <h2 className="text-2xl font-bold mb-8">🧾 Resume Builder</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md hover:bg-slate-600 transition ${
                isActive ? "bg-slate-800" : ""
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
