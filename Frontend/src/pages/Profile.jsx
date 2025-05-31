import React from 'react';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-black max-w-md w-full p-8 text-center">
        {/* Profile Picture Placeholder */}
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
          <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
        </div>

        <div className="space-y-4 mb-8">
          {/* Username Field */}
          <div className="text-lg">
            <span className="text-gray-700">Username : </span>
            <span className="text-gray-400">Not set</span>
          </div>

          {/* Email Field */}
          <div className="text-lg">
            <span className="text-gray-700">Email : </span>
            <span className="text-gray-400">Not set</span>
          </div>
        </div>

        <button className="bg-[#5885AF] hover:bg-[#334d66] text-white px-8 py-3 text-lg font-medium transition-colors duration-200">
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;