const ProjectCard = ({ project, onDelete }) => {
  const { title, description, tech, link } = project;

  return (
    <div className="border border-gray-600 bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-transform transform hover:scale-105">
      <h3 className="text-2xl font-bold text-purple-400 mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tech.map((t, i) => (
          <span
            key={i}
            className="bg-[#8245ec] text-white px-3 py-1 rounded-full text-xs"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-blue-400 hover:underline"
        >
          🔗 View
        </a>
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-sm font-medium"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
