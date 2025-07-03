const AchievementCard = ({ data, onDelete }) => {
  const { title, type, date, description } = data;

  return (
    <div className="border border-gray-600 bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-transform transform hover:scale-105">
      <h3 className="text-xl font-bold text-purple-400">{title}</h3>
      <p className="text-sm text-gray-300">{type}</p>
      <p className="text-sm text-gray-400">{date}</p>
      <p className="mt-2 text-gray-300">{description}</p>
      <button
        onClick={onDelete}
        className="mt-4 text-red-500 hover:text-red-600 text-sm font-medium"
      >
        Delete
      </button>
    </div>
  );
};

export default AchievementCard;
