import React, { useState } from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-md w-full p-8 text-center">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
            )}
          </div>
          
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="profile-image-input"
              />
              <label
                htmlFor="profile-image-input"
                className="absolute -bottom-2 -right-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-sm font-bold transition-colors duration-200"
              >
                +
              </label>
            </>
          )}
        </div>

        <div className="space-y-4 mb-8">
          {/* Username Field */}
          <div className="text-lg flex items-center">
            <span className="text-gray-700">Username : </span>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="ml-2 flex-1 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                placeholder="Enter username"
              />
            ) : (
              <span className="ml-2 text-gray-400">
                {username || 'Not set'}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="text-lg flex items-center">
            <span className="text-gray-700">Email : </span>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-2 flex-1 border-b border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                placeholder="Enter email"
              />
            ) : (
              <span className="ml-2 text-gray-400">
                {email || 'Not set'}
              </span>
            )}
          </div>
        </div>

        <button 
          onClick={handleEditToggle}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg font-medium transition-colors duration-200"
        >
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>
    </div>
  );
};

export default Profile;