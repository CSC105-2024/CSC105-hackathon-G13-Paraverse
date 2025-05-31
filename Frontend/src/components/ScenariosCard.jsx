import React from "react";

const ScenarioCard = ({ post, onExplore }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block bg-[#5885AF] text-white text-xs px-3 py-1 rounded-full">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#5885AF] mb-3 hover:text-[#416383] cursor-pointer">
        {post.title}
      </h3>

      {/* Description */}
      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
        {truncateText(post.details)}
      </p>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          {post.author.profilePicture ? (
            <img 
              src={post.author.profilePicture} 
              alt={post.author.username}
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
              <span className="text-xs text-gray-600">
                {post.author.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span>By {post.author.username}</span>
        </div>
        <span>{formatDate(post.createdAt)}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            124
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            5
          </span>
        </div>
        
        <button 
          onClick={() => onExplore(post.id)}
          className="bg-[#5885AF] text-white px-4 py-1 rounded text-sm hover:bg-[#416383] transition"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default ScenarioCard;