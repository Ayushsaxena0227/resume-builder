import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi"; // Icons

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
    { label: "Resume Analytics", path: "/analytics" },
    { label: "Feedback Inbox", path: "/feedbacks" },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // 🔒 Lock background scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger - Mobile only */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button onClick={toggleSidebar}>
          <FiMenu size={28} className="text-white" />
        </button>
      </div>

      {/* Sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-slate-900 to-slate-700 text-white z-50 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        {/* Scrollable inner section */}
        <div className="h-full flex flex-col p-5 overflow-y-auto">
          {/* Mobile close button */}
          <div className="lg:hidden text-right mb-4 shrink-0">
            <button onClick={toggleSidebar}>
              <FiX size={28} />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-8 shrink-0">
            🧾 Resume Builder
          </h2>

          {/* Links - scrollable */}
          <nav className="flex flex-col space-y-2 grow">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md transition hover:bg-slate-600 ${
                    isActive ? "bg-slate-800" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
