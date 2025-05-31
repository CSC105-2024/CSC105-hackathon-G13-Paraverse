import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ScenarioDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:3306/api/posts/${id}`);
            
            if (response.data.status) {
                setPost(response.data.post);
                setError("");
            } else {
                setError("Post not found");
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            if (error.response?.status === 404) {
                setError("Scenario not found");
            } else {
                setError("Failed to load scenario. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    if (!post) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 md:px-16 py-8">
            {/* Navigation */}
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

            {/* Main Content */}
            <div className="max-w-4xl mx-auto">
                {/* Category Badge */}
                <div className="mb-4">
                    <span className="inline-block bg-[#5885AF] text-white px-4 py-2 rounded-full text-sm font-medium">
                        {post.category}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#5885AF] mb-6 leading-tight">
                    {post.title}
                </h1>

                {/* Author and Date Info */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                        {post.author.profilePicture ? (
                            <img 
                                src={post.author.profilePicture} 
                                alt={post.author.username}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-[#5885AF] rounded-full mr-4 flex items-center justify-center">
                                <span className="text-white font-semibold text-lg">
                                    {post.author.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-gray-800">
                                {post.author.username}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {formatDate(post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center space-x-6 text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            124
                        </span>
                        <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            5
                        </span>
                    </div>
                </div>

                {/* Scenario Details */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Scenario Details</h2>
                    <div className="prose max-w-none">
                        <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                            {post.details}
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button className="flex items-center bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Like (124)
                        </button>
                        <button className="flex items-center bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 21l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                            </svg>
                            Comment
                        </button>
                        <button className="flex items-center bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                            Share
                        </button>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Discussion</h3>
                    
                    {/* Comment Form */}
                    <div className="mb-8">
                        <textarea
                            placeholder="Share your thoughts on this scenario..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5885AF] resize-none"
                            rows="4"
                        />
                        <div className="flex justify-end mt-3">
                            <button className="bg-[#5885AF] text-white px-6 py-2 rounded-lg hover:bg-[#416383] transition">
                                Post Comment
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {/* Sample Comment */}
                        <div className="border-b border-gray-200 pb-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-gray-600">JD</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-gray-800">JohnDoe</h4>
                                        <span className="text-sm text-gray-500">2 hours ago</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        This is a fascinating scenario! The implications would be far-reaching, affecting not just military strategy but also international relations and economic policies. I think we'd see a completely different geopolitical landscape today.
                                    </p>
                                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                        <button className="hover:text-[#5885AF] transition">Reply</button>
                                        <button className="hover:text-red-500 transition">Like (3)</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Another Sample Comment */}
                        <div className="border-b border-gray-200 pb-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-[#5885AF] rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">AS</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <h4 className="font-semibold text-gray-800">AliceSmith</h4>
                                        <span className="text-sm text-gray-500">4 hours ago</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">
                                        I wonder how this would have affected technology development. Without the massive military spending and research that followed, would we have achieved the same technological advances? The space race might never have happened.
                                    </p>
                                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                        <button className="hover:text-[#5885AF] transition">Reply</button>
                                        <button className="hover:text-red-500 transition">Like (7)</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Load More Comments */}
                        <div className="text-center">
                            <button className="text-[#5885AF] hover:text-[#416383] transition font-medium">
                                Load more comments
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Scenarios */}
                <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6">Related Scenarios</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Sample Related Posts */}
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <span className="inline-block bg-[#5885AF] text-white text-xs px-3 py-1 rounded-full mb-3">
                                History
                            </span>
                            <h4 className="font-semibold text-[#5885AF] mb-2 hover:text-[#416383] cursor-pointer">
                                What if the Roman Empire never fell?
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                                Explore how continuous Roman rule might have shaped modern civilization...
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>By HistoryBuff</span>
                                <button className="text-[#5885AF] hover:text-[#416383] transition">
                                    Explore →
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                            <span className="inline-block bg-[#5885AF] text-white text-xs px-3 py-1 rounded-full mb-3">
                                History
                            </span>
                            <h4 className="font-semibold text-[#5885AF] mb-2 hover:text-[#416383] cursor-pointer">
                                What if World War I never happened?
                            </h4>
                            <p className="text-gray-600 text-sm mb-3">
                                A world without the Great War would look dramatically different today...
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <span>By TimeExplorer</span>
                                <button className="text-[#5885AF] hover:text-[#416383] transition">
                                    Explore →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioDetail;