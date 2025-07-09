const FeedbackCard = ({ feedback }) => {
  return (
    <div className="bg-gray-800 border border-purple-600 rounded-lg p-5 shadow-md">
      <div className="text-purple-300 font-semibold mb-1">{feedback.name}</div>
      <div className="text-gray-400 text-sm mb-2">{feedback.email}</div>
      <p className="text-white">{feedback.message}</p>
    </div>
  );
};

export default FeedbackCard;
