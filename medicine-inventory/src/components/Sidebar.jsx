// components/Sidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-screen w-52 bg-blue-800 text-white fixed top-0 left-0 p-6 shadow-lg">
      <h1 className="text-2xl font-bold mb-8">Medical Store</h1>
      <ul className="space-y-4">
        <li>
          <Link
            to="/"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Inventory
          </Link>
        </li>
        <li>
          <Link
            to="/stock"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Stock
          </Link>
        </li>
        <li>
          <Link
            to="/invoice"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            New Invoice
          </Link>
        </li>
        <li>
          <Link
            to="/invoicelist"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Invoice List
          </Link>
        </li>
        <li>
          <Link
            to="/register"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Supplier Register
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Supplier Login
          </Link>
        </li>
        <li>
          <Link
            to="/RegisterStaff"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Staff Register
          </Link>
        </li>
        <li>
          <Link
            to="/StaffLogin"
            className="block bg-blue-700 hover:bg-yellow-500 hover:text-blue-900 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            Staff Login
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
