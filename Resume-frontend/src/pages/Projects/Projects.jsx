import React, { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./ProjectCard";

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

  const userId = "ayush123"; // TODO: Replace dynamically later

  const fetchProjects = async () => {
    try {
      setLoading(true); // Start loading
      const res = await axios.get(
        `http://localhost:5000/api/user/${userId}/projects`
      );
      const data = res.data || [];
      setProjects(data);
      console.log(projects);
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
    const data = {
      ...formData,
      tech: formData.tech.split(",").map((t) => t.trim()),
    };
    try {
      await axios.post(
        `http://localhost:5000/api/user/${userId}/projects`,
        data
      );
      setFormData({ title: "", description: "", tech: "", link: "" });
      fetchProjects(); // Refresh after adding
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/user/${userId}/projects/${projectId}`
      );
      fetchProjects();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <section className=" px-[12vw] md:px-[7vw] lg:px-[16vw] bg-skills-gradient clip-path-custom-3 text-white">
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
