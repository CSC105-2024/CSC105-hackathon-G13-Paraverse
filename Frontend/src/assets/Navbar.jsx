import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-gray-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        <div className="text-gray-800 font-semibold text-lg">Paraverse</div>
        <div className="space-x-6 hidden md:flex">
          <a href="/" className="text-gray-800 hover:text-[#5885AF]">Home</a>
          <a href="/category" className="text-gray-800 hover:text-[#5885AF]">Category</a>
        </div>
        <div className="space-x-6 hidden md:flex">
          <a href="/login" className="text-gray-800 hover:text-[#5885AF]">Login</a>
          <a href="/signup" className="text-gray-800 hover:text-[#5885AF]">Register</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;