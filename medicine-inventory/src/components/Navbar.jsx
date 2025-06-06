import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import axios from "axios";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [staffName, setStaffName] = useState(null); // Default to null for empty state
  const navigate = useNavigate();

  // Effect to read staff name from localStorage or fetch from API
  useEffect(() => {
    const localName = localStorage.getItem("staff_name");

    if (localName) {
      setStaffName(localName); // Set from localStorage if it exists
    } else {
      const token = localStorage.getItem("access_token");
      if (token) {
        axios
          .get("http://localhost:8000/api/staff/profile/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setStaffName(response.data.username);
            localStorage.setItem("staff_name", response.data.username); // Save in localStorage
          })
          .catch((err) => {
            console.error("Error fetching staff profile:", err);
          });
      }
    }
  }, []); // Empty dependency to run only on component mount

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("staff_name");
    setStaffName(null); // Clear staff name from state
    navigate("/StaffLogin"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-800 text-white py-1 shadow-md fixed w-full top-0 left-0 z-50">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-2">
          <h1 className="text-lg font-semibold tracking-wide">CITY SQUARE CARDIO CLINIC</h1>
        </div>

        {staffName && (
          <div className="mr-4 text-sm font-medium">
            <span className="font-bold">{staffName}</span>
          </div>
        )}

        <div className="relative">
          <button
            className="text-white text-2xl focus:outline-none transition-transform transform hover:scale-110"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white text-gray-900 rounded-lg shadow-lg border border-gray-200 animate-fadeIn">
              <ul className="flex flex-col text-base font-medium">
               {/* <li><Link to="/" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Home</Link></li>
                <li><Link to="/register" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Supplier Register</Link></li>
                <li><Link to="/login" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Supplier Login</Link></li>
                <li><Link to="/dashboard" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Supplier Dashboard</Link></li>
                <li><Link to="/stock" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Stock</Link></li>
                <li><Link to="/invoice" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Invoice</Link></li>
                <li><Link to="/invoicelist" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Invoice List</Link></li>
                <li><Link to="/RegisterStaff" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Register Staff</Link></li>
                <li><Link to="/StaffLogin" className="block px-4 py-2 hover:bg-blue-100" onClick={() => setMenuOpen(false)}>Staff Login</Link></li>*/}
                {staffName && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block px-4 py-2 hover:bg-blue-100 w-full text-left bg-white text-blue-800"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
