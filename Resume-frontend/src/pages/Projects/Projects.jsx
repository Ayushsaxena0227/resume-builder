import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";
import { auth } from "../../Firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectLoader = ({ count = 3 }) => {
  return (
    <div className="mt-12 grid gap-6 sm:grid-cols-2 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#1a1a2e] p-6 rounded-lg border border-gray-700 shadow-md"
        >
          <div className="h-6 bg-gray-600 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="h-8 bg-gray-800 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaderCount, setLoaderCount] = useState(3);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: "",
    link: "",
  });
  const baseURL = import.meta.env.VITE_URL || "http://localhost:5000";

  const fetchProjects = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not logged in");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await user.getIdToken();

      const res = await axios.get(`${baseURL}/api/user/${user.uid}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data || [];
      setProjects(data);
      setLoaderCount(data.length > 0 ? data.length : 3);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoaderCount(3);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not logged in");
      return;
    }

    const data = {
      ...formData,
      tech: formData.tech.split(",").map((t) => t.trim()),
    };

    try {
      const token = await user.getIdToken();

      await axios.post(`${baseURL}/api/user/${user.uid}/projects`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Project addded");
      setFormData({ title: "", description: "", tech: "", link: "" });
      fetchProjects();
    } catch (error) {
      toast.error("Failed to add project");
      console.error("Error adding project:", error);
    }
  };

  const handleDelete = async (projectId) => {
    const user = auth.currentUser;

    if (!user) {
      console.warn("User not logged in");
      return;
    }

    try {
      const token = await user.getIdToken();

      await axios.delete(
        `${baseURL}/api/user/${user.uid}/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("project deleted");
      fetchProjects();
    } catch (error) {
      toast.error("failed to delete");
      console.error("Error deleting project:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section className=" px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom-3 text-white">
      <ToastContainer />
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold">PROJECTS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-medium">
          Showcase your development work here
        </p>
      </div>

      {loading ? (
        <ProjectLoader count={loaderCount} />
      ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 mb-12">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={() => handleDelete(project.id)}
              />
            ))
          ) : (
            <div className="text-center col-span-2 text-gray-400">
              No projects added yet.
            </div>
          )}
        </div>
      )}

      <p className="text-gray-400 mt-4 text-lg font-medium text-center">
        Add More Projects
      </p>

      <form
        onSubmit={handleAdd}
        className="bg-[#0d081f] p-6 rounded-lg border border-gray-700 max-w-2xl mx-auto space-y-4 shadow-lg"
      >
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Project Title"
          className="form-input"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Short Description"
          rows="2"
          className="form-input"
          required
        />
        <input
          type="text"
          name="tech"
          value={formData.tech}
          onChange={(e) => setFormData({ ...formData, tech: e.target.value })}
          placeholder="Tech Stack (comma separated)"
          className="form-input"
          required
        />
        <input
          type="url"
          name="link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="Project Link"
          className="form-input"
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 py-3 text-white font-semibold rounded-md hover:opacity-90 transition"
        >
          Add Project
        </button>
      </form>
    </section>
  );
};

export default Projects;
