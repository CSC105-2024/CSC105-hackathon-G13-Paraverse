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
    if (!text) return ''; // Handle cases where details might be null or undefined
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Use post.likes and post.commentCount, providing fallbacks if they might be undefined
  const likeCount = post.likes !== undefined ? post.likes : 0;
  // Assuming your post object will have a commentCount property.
  // If it's named differently (e.g., comments_count or fetched separately and added to post),
  // adjust accordingly. For this example, I'll use post.commentCount.
  const commentCount = post.commentCount !== undefined ? post.commentCount : 0;

  return (
    <div className="bg-white rounded shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* Category Badge */}
      <div className="mb-3">
        <span className="inline-block bg-[#5885AF] text-white text-xs px-3 py-1 rounded-full">
          {post.category || 'N/A'}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#5885AF] mb-3 hover:text-[#416383] cursor-pointer"  onClick={() => onExplore(post.id)}>
        {post.title || 'Untitled Scenario'}
      </h3>

      {/* Description */}
      <p className="text-gray-700 mb-4 text-sm leading-relaxed">
        {truncateText(post.details)}
      </p>

      {/* Author and Date */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center">
          {post.author?.profilePicture ? (
            <img
              src={post.author.profilePicture}
              alt={post.author.username || 'Author'}
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
              <span className="text-xs text-gray-600">
                {(post.author?.username?.charAt(0) || 'A').toUpperCase()}
              </span>
            </div>
          )}
          <span>By {post.author?.username || 'Unknown Author'}</span>
        </div>
        <span>{post.createdAt ? formatDate(post.createdAt) : 'Date N/A'}</span>
      </div>

      {/* Actions: Likes and Comments */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {likeCount} {/* Display dynamic like count */}
          </span>
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
            {commentCount} {/* Display dynamic comment count */}
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