import React from "react";


const PostYourScenario = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 px-4">
        <h1 className="text-2xl font-semibold text-[#5885AF] mb-2 py-2">Create a new scenario</h1>
        <p className="text-sm text-gray-600 mb-8 text-center max-w-md">
          Unleash your imagination and propose a "what if" question for the community to explore
        </p>
  
        <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
          <div className="mb-6">
            <label className="block font-semibold mb-1">
              Scenario Title(“What if…”)
            </label>
            <input
              type="text"
              placeholder='Post a compelling "what if" question that sparks curiosity.'
              className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100 placeholder:text-sm"
            />
          </div>
  
          <div className="mb-6">
            <label className="block font-semibold mb-1">
              Detailed Description
            </label>
            <textarea
              placeholder="Provide enough detail to help others understand and contribute to your scenarios. This will be the remain content of your post."
              className="w-full px-4 py-2 h-32 border border-gray-300 rounded bg-gray-100 placeholder:text-sm"
            ></textarea>
          </div>
  
          <div className="mb-6">
            <label className="block font-semibold mb-1">Catagory</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100">
              <option>Select a category</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">
              Categorizing help other find your scenario.
            </p>
          </div>
  
          <button className="w-full bg-[#5885AF] text-white py-2 rounded hover:bg-[#416383] transition">
            Post scenario
          </button>
        </div>
      </div>
    );
  }
  

export default PostYourScenario;