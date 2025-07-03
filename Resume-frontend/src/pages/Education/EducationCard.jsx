const EducationCard = ({
  degree,
  institute,
  startYear,
  endYear,
  score,
  onDelete,
}) => {
  return (
    <div className="border border-white bg-gray-900 p-6 rounded-lg shadow-[0_0_15px_1px_rgba(130,69,236,0.2)]">
      <h3 className="text-xl font-semibold">{degree}</h3>
      <p className="text-sm text-gray-400">{institute}</p>
      <p className="text-sm mt-2">
        Years: {startYear} - {endYear}
      </p>
      <p className="text-sm text-purple-400">Score: {score}</p>
      <button
        onClick={onDelete}
        className="mt-4 text-red-400 hover:text-red-600 font-medium"
      >
        Delete
      </button>
    </div>
  );
};

export default EducationCard;
