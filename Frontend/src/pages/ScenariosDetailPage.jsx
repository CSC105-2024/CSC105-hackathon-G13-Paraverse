import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ScenarioDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPost();
        const likedBefore = localStorage.getItem(`liked_post_${id}`);
        if (likedBefore) setLiked(true);
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3306/api/posts/${id}`);
            if (response.data.status) {
                setPost(response.data.post);
                setLikes(response.data.post.likes || 0);
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

    const handleLike = async () => {
        if (liked) return;
        try {
            const response = await axios.patch(`http://localhost:3306/api/posts/${id}/like`);
            if (response.data.status) {
                setLikes(response.data.likes);
                setLiked(true);
                localStorage.setItem(`liked_post_${id}`, "true");
            }
        } catch (err) {
            console.error("Error liking post:", err);
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
        <div className="min-h-screen bg-gray-100 px-4 md:px-16 py-8">
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
                <div className="mb-4">
                    <span className="inline-block bg-[#5885AF] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {post.category}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[#5885AF] mb-6 leading-tight">
                    {post.title}
                </h1>

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
                            disabled={liked}
                            className={`flex items-center ${liked ? "text-red-500" : "hover:text-red-500"} transition`}
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            Like ({likes})
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Scenario Details</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.details}
                        </p>
                    </div>
                </div>

                {/* Comments section remains unchanged */}
                {/* ... */}
            </div>
        </div>
    );
};

export default ScenarioDetail;
