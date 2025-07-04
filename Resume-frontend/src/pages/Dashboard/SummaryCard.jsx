const SummaryCard = ({ title, children }) => {
  return (
    <div className="bg-[#131025] border border-gray-700 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold text-purple-400 mb-3">{title}</h3>
      <div className="text-gray-300 text-sm">{children}</div>
    </div>
  );
};

export default SummaryCard;
