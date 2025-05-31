import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

const ScenarioDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [likeLoading, setLikeLoading] = useState(false);
    
    // Edit functionality states
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        details: "",
        category: ""
    });
    const [editLoading, setEditLoading] = useState(false);
    
    // Delete functionality states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Comments functionality states
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [editCommentContent, setEditCommentContent] = useState("");
    const [deletingComment, setDeletingComment] = useState(null);

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (post) {
            fetchComments();
            if (isAuthenticated) {
                fetchLikeStatus();
            }
        }
    }, [post, isAuthenticated]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3306/api/posts/${id}`);
            if (response.data.status) {
                setPost(response.data.post);
                setLikes(response.data.post.likes || 0);

                setEditForm({
                    title: response.data.post.title,
                    details: response.data.post.details,
                    category: response.data.post.category
                });

                setError("");
            } else {
                setError("Post not found");
            }
        } catch (error) {
            console.error("Error fetching post:", error);
            if (error.response?.status === 404) {
                setError("Scenario not found");
            } else {
                setError("Failed to load scenario. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchLikeStatus = async () => {
        if (!isAuthenticated) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `http://localhost:3306/api/posts/${id}/like/status`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            
            if (response.data.success) {
                setLiked(response.data.data.liked);
            }
        } catch (error) {
            console.error("Error fetching like status:", error);
        }
    };

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const response = await axios.get(`http://localhost:3306/api/posts/${id}/comments`);
            if (response.data.success) {
                setComments(response.data.data.comments);
                setCommentCount(response.data.data.count);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert("Please log in to like posts");
            return;
        }

        if (likeLoading) return;

        try {
            setLikeLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:3306/api/posts/${id}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                const { action, liked: newLikedStatus } = response.data.data;
                setLiked(newLikedStatus);
                
                // Update like count based on action
                if (action === 'liked') {
                    setLikes(prev => prev + 1);
                } else if (action === 'unliked') {
                    setLikes(prev => Math.max(0, prev - 1));
                }
            } else {
                alert("Failed to update like: " + response.data.message);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("Failed to update like. Please try again.");
        } finally {
            setLikeLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            title: post.title,
            details: post.details,
            category: post.category
        });
    };

    const handleSaveEdit = async () => {
        try {
            setEditLoading(true);
            const response = await axios.put(`http://localhost:3306/api/posts/${id}`, editForm);
            
            if (response.data.status) {
                setPost(response.data.post);
                setIsEditing(false);
                alert("Post updated successfully!");
            } else {
                alert("Failed to update post: " + response.data.message);
            }
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post. Please try again.");
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            setDeleteLoading(true);
            const response = await axios.delete(`http://localhost:3306/api/posts/${id}`);
            
            if (response.data.status) {
                alert("Post deleted successfully!");
                navigate(-1);
            } else {
                alert("Failed to delete post: " + response.data.message);
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post. Please try again.");
        } finally {
            setDeleteLoading(false);
            setShowDeleteModal(false);
        }
    };

    // Comment functions
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !isAuthenticated) return;

        try {
            setCommentSubmitting(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:3306/api/comments',
                {
                    content: newComment.trim(),
                    postId: parseInt(id)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setNewComment("");
                fetchComments();
            } else {
                alert("Failed to post comment: " + response.data.error);
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleEditComment = (comment) => {
        setEditingComment(comment.id);
        setEditCommentContent(comment.content);
    };

    const handleSaveCommentEdit = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `http://localhost:3306/api/comments/${commentId}`,
                {
                    content: editCommentContent.trim()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setEditingComment(null);
                setEditCommentContent("");
                fetchComments();
            } else {
                alert("Failed to update comment: " + response.data.error);
            }
        } catch (error) {
            console.error("Error updating comment:", error);
            alert("Failed to update comment. Please try again.");
        }
    };

    const handleCancelCommentEdit = () => {
        setEditingComment(null);
        setEditCommentContent("");
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            setDeletingComment(commentId);
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:3306/api/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                fetchComments();
            } else {
                alert("Failed to delete comment: " + response.data.error);
            }
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again.");
        } finally {
            setDeletingComment(null);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleBack = () => {
        navigate(-1);
    };

    // Check if current user is the owner of the post
    const isOwner = isAuthenticated && user && post && post.author.id === user.id;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5885AF]"></div>
                <p className="mt-4 text-gray-600">Loading scenario...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
                <div className="bg-white rounded shadow-md p-8 max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h1 className="text-xl font-semibold text-gray-800 mb-2">Oops!</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={handleBack}
                        className="bg-[#5885AF] text-white px-6 py-2 rounded hover:bg-[#416383] transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="min-h-screen bg-gray-100 px-4 md:px-16 py-20">
            <div className="max-w-4xl mx-auto mb-6">
                <button
                    onClick={handleBack}
                    className="flex items-center text-[#5885AF] hover:text-[#416383] transition mb-4"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Scenarios
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="mb-4 flex justify-between items-start">
                    <span className="inline-block bg-[#5885AF] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                                className="bg-transparent border-b border-white text-white placeholder-gray-200 focus:outline-none"
                                placeholder="Category"
                            />
                        ) : (
                            post.category
                        )}
                    </span>
                    
                    {/* Owner Actions */}
                    {isOwner && !isEditing && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleEdit}
                                className="flex items-center text-blue-600 hover:text-blue-800 transition"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex items-center text-red-600 hover:text-red-800 transition"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    )}

                    {/* Edit Mode Actions */}
                    {isOwner && isEditing && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSaveEdit}
                                disabled={editLoading}
                                className="flex items-center bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {editLoading ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                                ) : (
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                Save
                            </button>
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Title - Editable */}
                {isEditing ? (
                    <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                        className="text-3xl md:text-4xl font-bold text-[#5885AF] mb-6 leading-tight w-full border-b-2 border-[#5885AF] focus:outline-none bg-transparent"
                        placeholder="Post title"
                    />
                ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-[#5885AF] mb-6 leading-tight">
                        {post.title}
                    </h1>
                )}

                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {post.author?.profilePicture ? (
                            <img
                                src={post.author.profilePicture}
                                alt={post.author.username}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-[#5885AF] rounded-full mr-4 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {post.author?.username?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {post.author?.username}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6 text-gray-500">
                        <button
                            onClick={handleLike}
                            disabled={likeLoading}
                            className={`flex items-center transition ${
                                liked 
                                    ? "text-red-500" 
                                    : "hover:text-red-500"
                            } ${
                                likeLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {likeLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
                            ) : (
                                <svg 
                                    className="w-5 h-5 mr-2" 
                                    fill={liked ? "currentColor" : "none"} 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            )}
                            {liked ? "Unlike" : "Like"} ({likes})
                        </button>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                            </svg>
                            Comments ({commentCount})
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Scenario Details</h2>
                    <div className="prose max-w-none">
                        {isEditing ? (
                            <textarea
                                value={editForm.details}
                                onChange={(e) => setEditForm({...editForm, details: e.target.value})}
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5885AF] resize-none"
                                placeholder="Post details"
                            />
                        ) : (
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                {post.details}
                            </p>
                        )}
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Comments ({commentCount})
                    </h2>

                    {/* Comment Form */}
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitComment} className="mb-6">
                            <div className="flex items-start space-x-4">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-[#5885AF] rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold">
                                            {user?.username?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Write a comment..."
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5885AF] resize-none"
                                        rows="3"
                                        maxLength="1000"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-sm text-gray-500">
                                            {newComment.length}/1000 characters
                                        </span>
                                        <button
                                            type="submit"
                                            disabled={!newComment.trim() || commentSubmitting}
                                            className="bg-[#5885AF] text-white px-4 py-2 rounded hover:bg-[#416383] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            {commentSubmitting && (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            )}
                                            Post Comment
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                            <p className="text-gray-600">Please log in to post a comment.</p>
                        </div>
                    )}

                    {/* Comments List */}
                    {commentsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5885AF]"></div>
                            <span className="ml-2 text-gray-600">Loading comments...</span>
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <div key={comment.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                                    {comment.author?.profilePicture ? (
                                        <img
                                            src={comment.author.profilePicture}
                                            alt={comment.author.username}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 bg-[#5885AF] rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {comment.author?.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">
                                                    {comment.author?.username}
                                                </h4>
                                                <p className="text-sm text-gray-500">
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                            </div>
                                            {/* Comment Actions */}
                                            {isAuthenticated && user && comment.author.id === user.id && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEditComment(comment)}
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        disabled={deletingComment === comment.id}
                                                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                                                    >
                                                        {deletingComment === comment.id ? "Deleting..." : "Delete"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {editingComment === comment.id ? (
                                            <div>
                                                <textarea
                                                    value={editCommentContent}
                                                    onChange={(e) => setEditCommentContent(e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5885AF] resize-none"
                                                    rows="3"
                                                    maxLength="1000"
                                                />
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <button
                                                        onClick={handleCancelCommentEdit}
                                                        className="px-3 py-1 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleSaveCommentEdit(comment.id)}
                                                        className="px-3 py-1 bg-[#5885AF] text-white rounded hover:bg-[#416383] transition"
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Delete Post</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 flex items-center"
                            >
                                {deleteLoading && (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ScenarioDetail;