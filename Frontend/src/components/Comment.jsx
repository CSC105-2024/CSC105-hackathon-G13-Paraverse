import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AiOutlineEdit, AiOutlineDelete, AiOutlineSend } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token'); // Adjust based on how you store the token
  };

  // Get current user info from localStorage
  const getCurrentUser = () => {
    const userInfo = localStorage.getItem('user'); // Adjust based on how you store user info
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const currentUser = getCurrentUser();

  // Fetch comments when component mounts
  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3306/api/posts/${postId}/comments`);
      if (response.data.success) {
        setComments(response.data.data.comments);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = getAuthToken();
    if (!token) {
      setError('Please login to comment');
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3306/api/comments',
        {
          content: newComment.trim(),
          postId: postId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setNewComment('');
        setError('');
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError(err.response?.data?.error || 'Failed to post comment');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    const token = getAuthToken();
    if (!token) {
      setError('Please login to edit comments');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3306/api/comments/${commentId}`,
        {
          content: editContent.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setComments(comments.map(comment => 
          comment.id === commentId ? response.data.data : comment
        ));
        setEditingComment(null);
        setEditContent('');
        setError('');
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(err.response?.data?.error || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    const token = getAuthToken();
    if (!token) {
      setError('Please login to delete comments');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3306/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setComments(comments.filter(comment => comment.id !== commentId));
        setError('');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  const startEdit = (comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isCommentOwner = (comment) => {
    return currentUser && comment.author.id === currentUser.id;
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-800">
        Comments ({comments.length})
      </h3>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {currentUser.profilePicture ? (
                <img 
                  src={currentUser.profilePicture} 
                  alt={currentUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <FaUser className="text-gray-600 text-sm" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5885AF] focus:border-transparent"
                rows="3"
                maxLength="1000"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitLoading}
                  className="px-4 py-2 bg-[#5885AF] text-white rounded-lg hover:bg-[#46698a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <AiOutlineSend />
                  <span>{submitLoading ? 'Posting...' : 'Post Comment'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg text-center">
          <p className="text-gray-600">
            Please <a href="/login" className="text-[#5885AF] hover:underline font-semibold">login</a> to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5885AF]"></div>
          <p className="mt-2 text-gray-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {comment.author.profilePicture ? (
                    <img 
                      src={comment.author.profilePicture} 
                      alt={comment.author.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <FaUser className="text-gray-600 text-sm" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-800">
                      {comment.author.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(comment.createdAt)}
                    </span>
                    {comment.updatedAt !== comment.createdAt && (
                      <span className="text-xs text-gray-400">(edited)</span>
                    )}
                  </div>
                  
                  {editingComment === comment.id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#5885AF] focus:border-transparent"
                        rows="3"
                        maxLength="1000"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          {editContent.length}/1000 characters
                        </span>
                        <div className="space-x-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleEditComment(comment.id)}
                            disabled={!editContent.trim()}
                            className="px-3 py-1 bg-[#5885AF] text-white rounded hover:bg-[#46698a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {comment.content}
                      </p>
                      
                      {isCommentOwner(comment) && (
                        <div className="flex items-center space-x-3 mt-2">
                          <button
                            onClick={() => startEdit(comment)}
                            className="text-sm text-gray-500 hover:text-[#5885AF] transition-colors flex items-center space-x-1"
                          >
                            <AiOutlineEdit />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-sm text-red-500 hover:text-red-700 transition-colors flex items-center space-x-1"
                          >
                            <AiOutlineDelete />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;