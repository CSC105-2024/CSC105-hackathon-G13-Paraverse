import React, { useState } from "react";
import { ThumbsUp, Edit, Trash2, User } from "lucide-react";

const Scenarios = () => {
    // State for scenario data - ready for backend integration
    const [scenario] = useState({
        id: 1,
        category: "History",
        title: "What If 9/11 didn't happened?",
        author: "SunnyTawan",
        date: "Sep 9, 2023",
        likes: 124,
        isLiked: false,
        content: "The only NATO Article V ever to occur would not have been in place. Many of the US bases in the Middle East probably would be smaller or nonexistent. The CENTCOM focus would be greatly diminished and much of the funding would have gone to EUCOM or INDOPACOM...."
    });

    const [comments, setComments] = useState([
        {
            id: 1,
            username: "User123123",
            text: "test comment",
            avatar: null
        },
        {
            id: 2,
            username: "User123123", 
            text: "test comment",
            avatar: null
        }
    ]);

    const [newComment, setNewComment] = useState("");

    // Function to handle posting new comment - placeholder for backend
    const handlePostComment = () => {
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(), // In real app, this would come from backend
            username: "CurrentUser", // This would come from user auth
            text: newComment,
            avatar: null
        };
        setComments([...comments, comment]);
        setNewComment("");
    };

    // Function to handle comment deletion - placeholder for backend
    const handleDeleteComment = (commentId) => {
        setComments(comments.filter(comment => comment.id !== commentId));
    };

    // Function to handle comment editing - placeholder for backend
    const handleEditComment = (commentId) => {
        console.log("Edit comment:", commentId);
    };

    return (
        <div className="bg-gray-200 min-h-screen py-12">
            {/* Category Tag */}
            <div className="pt-6 px-6">
                <span className="bg-[#5885AF] text-white px-4 py-2 rounded text-sm font-medium">
                    {scenario.category}
                </span>
            </div>

            {/* Scenario Title */}
            <div className="px-6 pt-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                    {scenario.title}
                </h1>
                
                {/* Author Info */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                    <span>By {scenario.author}</span>
                    <span>{scenario.date}</span>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{scenario.likes}</span>
                    </div>
                </div>
            </div>

            {/* Scenario Details Section */}
            <div className="px-6 mb-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Scenario Details
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {scenario.content}
                    </p>
                </div>
            </div>

            {/* Discussion Section */}
            <div className="px-6 pb-8">
                <div className="bg-[#5885AF] rounded-lg p-6 ">
                    <h3 className="text-white text-lg font-semibold mb-4">
                        Discussion
                    </h3>
                    
                    {/* Comment Input */}
                    <div className="mb-6">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="What you thought of this scenario"
                            className="w-full p-3 rounded border bg-gray-300 resize-none h-20 text-gray-700"
                            rows="3"
                        />
                        <button
                            onClick={handlePostComment}
                            className="mt-3 bg-gray-800 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
                        >
                            Post Comment
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-3">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-white rounded-lg p-4 flex items-start gap-3">
                                {/* Avatar */}
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                    {comment.avatar ? (
                                        <img 
                                            src={comment.avatar} 
                                            alt={comment.username}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-6 h-6 text-gray-600" />
                                    )}
                                </div>
                                
                                {/* Comment Content */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-semibold text-gray-800">
                                            {comment.username}
                                        </h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditComment(comment.id)}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteComment(comment.id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 mt-1">
                                        {comment.text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scenarios;