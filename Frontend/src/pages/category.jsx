import React from 'react';
import { NavLink } from 'react-router-dom';

const Category = () => {
  const categories = [
    {
      title: 'Politics',
      description: 'Explore scenario related to politics',
      link: 'View scenarios',
    },
    {
      title: 'History',
      description: 'Explore scenario related to history',
      link: 'View scenarios'
    },
    {
      title: 'Science and Technology',
      description: 'Explore scenario related to politics',
      link: 'View scenarios'
    },
    {
      title: 'Pop-Culture',
      description: 'Explore scenario related to history',
      link: 'View scenarios'
    },
    {
      title:"General",
      description: 'Explore scenario related to general topics',
      link: 'View scenarios'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-200 py-20">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-1">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-3xl font-normal text-[#5885AF] mb-2">Explore Category</h1>
          <p className="text-gray-600">Browse scenarios by topics and interest</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-normal text-[#5885AF] mb-3">{category.title}</h2>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <NavLink
                to={`/tag/${category.title.replace(/\s+/g, '-')}`}
                className="text-orange-400 hover:text-orange-500 font-medium"
              >
                {category.link}
              </NavLink>
            </div>
          ))}
        </div>
      </div>
      </div>
  );
};

export default Category;