import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-300 shadow-md fixed w-full ">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-gray-800 font-semibold text-lg">Paraverse</div>
        <div className="space-x-6 hidden md:flex">
          <NavLink to="/Home" className="text-gray-800 hover:text-[#5885AF] transition-colors">
            Home
          </NavLink>
          <NavLink to="/category" className="text-gray-800 hover:text-[#5885AF] transition-colors">
            What-if-Category
          </NavLink>
        </div>
        <div className="space-x-6 hidden md:flex">
          <NavLink to="/Profile" className="text-gray-800 hover:text-[#5885AF] transition-colors">
            Profile
          </NavLink>
          <a className="text-red-600 hover:text-red-800 transition-colors font-bold">
            Logout
          </a>
        </div>
      <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-700 focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        </div>
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 w-3/4 max-w-xs h-full bg-gray-300 z-50 px-6 py-5 flex flex-col gap-6 text-gray-700 font-medium shadow-lg">
            <h1 className="text-xl font-medium text-gray-700">Paraverse</h1>
              <>
                <NavLink
                  to="/Home"
                  end
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/category"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  What-if-Category
                </NavLink>
                <NavLink
                  to="/profile"
                  className="hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                  }}
                  className="text-left hover:text-black"
                >
                  Logout
                </button>
              </>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;