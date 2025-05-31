import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PostYourScenario = () => {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    category: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3306/api/categories');
      if (response.data.status) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.details || !formData.category) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const token = localStorage.getItem('token'); // Assuming you store JWT token in localStorage
      
      const response = await axios.post('http://localhost:3306/api/posts', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        setMessage("Scenario posted successfully!");
        setFormData({ title: "", details: "", category: "" });
        
        // Use React Router navigation instead of window.location.href
        setTimeout(() => {
          navigate('/');
        }, 200);
      } else {
        setMessage(response.data.message || "Failed to post scenario");
      }
    } catch (error) {
      console.error('Error posting scenario:', error);
      if (error.response?.status === 401) {
        setMessage("Please login to post a scenario");
      } else {
        setMessage("Failed to post scenario. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 px-4">
      <h1 className="text-2xl font-semibold text-[#5885AF] mb-2 py-2">Create a new scenario</h1>
      <p className="text-sm text-gray-600 mb-8 text-center max-w-md">
        Unleash your imagination and propose a "what if" question for the community to explore
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        {message && (
          <div className={`mb-4 p-3 rounded ${
            message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mb-6">
          <label className="block font-semibold mb-1">
            Scenario Title("What if…")
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder='Post a compelling "what if" question that sparks curiosity.'
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 placeholder:text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">
            Detailed Description
          </label>
          <textarea
            name="details"
            value={formData.details}
            onChange={handleInputChange}
            placeholder="Provide enough detail to help others understand and contribute to your scenarios. This will be the remain content of your post."
            className="w-full px-4 py-2 h-32 border border-gray-300 rounded bg-gray-100 placeholder:text-sm"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-1">Category</label>
          <select 
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            Categorizing helps others find your scenario.
          </p>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#5885AF] text-white py-2 rounded hover:bg-[#416383] transition disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post scenario"}
        </button>
      </form>
    </div>
  );
};

export default PostYourScenario;