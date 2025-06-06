import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postAPI } from "../utils/api.js";
import ScenarioCard from "../components/ScenariosCard.jsx";

const Tag = () => {
    const { category } = useParams(); // Get the tag from the URL
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchPosts();
    }, [category, currentPage]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                category: category.replace(/-/g, ' ') // handle slugs like "science-and-technology"
            };

            const response = await postAPI.getAllPosts(params);
            if (response.data.status) {
                setPosts(response.data.posts);
                setTotalPages(response.data.pagination.totalPages);
                setError("");
            } else {
                setError("Failed to fetch posts.");
            }
        } catch (err) {
            console.error("Error fetching tagged posts:", err);
            setError("Something went wrong while loading.");
        } finally {
            setLoading(false);
        }
    };

    const handleExplore = (postId) => {
        navigate(`/scenario/${postId}`);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="bg-gray-100 min-h-screen px-4 md:px-16 py-18">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded shadow-md p-6 max-w-4xl mx-auto mb-8">
                <h1 className="text-2xl font-semibold text-[#5885AF] mb-2 capitalize">
                    Showing scenarios in "{category.replace(/-/g, ' ')}"
                </h1>
                <p className="text-gray-600 mb-6">Browse all scenarios under this category.</p>
                </div>
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5885AF] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading scenarios...</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500 text-lg">No scenarios found for this category.</p>
                    </div>
                )}

                {!loading && !error && posts.length > 0 && (
                    <>
                        {posts.map(post => (
                            <ScenarioCard 
                                key={post.id} 
                                post={post} 
                                onExplore={handleExplore}
                            />
                        ))}

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8 space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Previous
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 rounded ${
                                                currentPage === page
                                                    ? "bg-[#5885AF] text-white"
                                                    : "bg-white border border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Tag;
