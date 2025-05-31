import React, { useState, useEffect } from "react";
import { postAPI } from "../utils/api.js";
import Navbar from "../assets/Navbar.jsx";
import ScenarioCard from "../components/ScenariosCard.jsx";
import { NavLink, useNavigate } from "react-router-dom";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, [currentPage, selectedCategory]);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(selectedCategory && { category: selectedCategory })
            };

            const response = await postAPI.getAllPosts(params);

            if (response.data.status) {
                setPosts(response.data.posts);
                setTotalPages(response.data.pagination.totalPages);
                setError("");
            } else {
                setError("Failed to fetch posts");
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError("Failed to load scenarios. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await postAPI.getCategories();
            if (response.data.status) {
                setCategories(response.data.categories);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    };

    const handleExplore = (postId) => {
        navigate(`/scenario/${postId}`);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-100 min-h-screen px-4 md:px-16 py-8">
            <div className="bg-white rounded shadow-md p-6 max-w-4xl mx-auto mb-8">
                <h1 className="text-2xl font-semibold text-[#5885AF] mb-2">Welcome to Paraverse</h1>
                <p className="text-gray-600 mb-4">Dive into alternate realities and explore fascinating "what if" scenarios.</p>
                <NavLink to='/Post' className="bg-[#A05A2C] text-white px-4 py-2 rounded hover:bg-[#8B4513] transition">
                    Post your scenario
                </NavLink>
            </div>

            <div className="bg-white rounded shadow-md p-6 max-w-4xl mx-auto mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => handleCategoryFilter("")}
                        className={`px-3 py-1 rounded text-sm transition ${
                            selectedCategory === "" 
                                ? "bg-[#5885AF] text-white" 
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        All
                    </button>
                    {categories.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryFilter(category)}
                            className={`px-3 py-1 rounded text-sm transition ${
                                selectedCategory === category 
                                    ? "bg-[#5885AF] text-white" 
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <h2 className="text-lg font-semibold mb-4">Scenarios</h2>

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
                        <p className="text-gray-500 text-lg">No scenarios found.</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {selectedCategory 
                                ? "Try adjusting your category filter." 
                                : "Be the first to post a scenario!"
                            }
                        </p>
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

export default Home;
