import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-blue-600 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-white text-2xl font-bold">
          City Square Cardio Clinic
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-gray-300">
            Medicine Inventory
          </Link>
          <Link to="/stock" className="text-white hover:text-gray-300">
            Stock Inventory
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300">
            Supplier Register
          </Link>
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link to="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </Link>
          <Link to="/invoice" className="text-white hover:text-gray-300">
            invoice
          </Link>
          <Link to="/invoicelist" className="text-white hover:text-gray-300">
            invoice list 
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-700 text-white text-center flex flex-col py-2">
          <Link to="/" className="py-2 hover:bg-blue-500" onClick={closeMenu}>
            Medicine Inventory
          </Link>
          <Link to="/stock" className="py-2 hover:bg-blue-500" onClick={closeMenu}>
            Stock Inventory
          </Link>
          <Link to="/register" className="py-2 hover:bg-blue-500" onClick={closeMenu}>
            Supplier Register
          </Link>
          <Link to="/login" className="py-2 hover:bg-blue-500" onClick={closeMenu}>
            Login
          </Link>
          <Link to="/dashboard" className="py-2 hover:bg-blue-500" onClick={closeMenu}>
            Dashboard
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
