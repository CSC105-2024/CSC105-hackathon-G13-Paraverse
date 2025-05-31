import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 
      ${isMenuOpen ? 'bg-white shadow-lg' : 'bg-white md:bg-black/10 md:backdrop-blur-lg md:backdrop-saturate-150'}
    `}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-gray-800 font-semibold text-lg">Paraverse</div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLink to="/Home" className="text-gray-800 hover:text-[#5885AF] transition-colors">Home</NavLink>
          <NavLink to="/category" className="text-gray-800 hover:text-[#5885AF] transition-colors">What-if-Category</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <NavLink to="/Profile" className="text-gray-800 hover:text-[#5885AF] transition-colors">Profile</NavLink>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 transition-colors font-bold">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-gray-800 hover:text-[#5885AF] transition-colors">Login</NavLink>
              <NavLink to="/signup" className="text-gray-800 hover:text-[#5885AF] transition-colors">Signup</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none" aria-label="Toggle Menu">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-40 z-40"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 w-64 h-full bg-white z-50 px-6 py-5 flex flex-col gap-6 text-gray-700 font-medium shadow-lg">
            <h1 className="text-xl font-semibold text-gray-700">Paraverse</h1>

            <NavLink to="/Home" onClick={() => setIsMenuOpen(false)} className="hover:text-[#5885AF]">Home</NavLink>
            <NavLink to="/category" onClick={() => setIsMenuOpen(false)} className="hover:text-[#5885AF]">What-if-Category</NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/Profile" onClick={() => setIsMenuOpen(false)} className="hover:text-[#5885AF]">Profile</NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="hover:text-[#5885AF]">Login</NavLink>
                <NavLink to="/signup" onClick={() => setIsMenuOpen(false)} className="hover:text-[#5885AF]">Signup</NavLink>
              </>
            )}
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
