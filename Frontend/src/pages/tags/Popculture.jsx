import React from 'react';

const Popculture = ({ scenarios = [] }) => {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors">
            ← Back to Categories
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pop-Culture Scenarios</h1>
          <p className="text-gray-600">Explore scenario related to pop-culture</p>
        </div>

        {/* Scenarios List */}
        <div className="space-y-6">
          {scenarios.length > 0 ? (
            scenarios.map((scenario) => (
              <div 
                key={scenario.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  {scenario.title}
                </h2>
                
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {scenario.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      👤 By {scenario.author}
                    </div>
                    <div className="flex items-center">
                      📅 {scenario.date}
                    </div>
                  </div>
                  
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {scenario.category}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No scenarios available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Popculture;