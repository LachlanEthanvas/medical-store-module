import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterStaff = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/staff/register/', formData);
      setMessage('Staff registered successfully!');
      setTimeout(() => {
        navigate('/staff-login');
      }, 1500); 
    } catch (error) {
      console.error(error.response?.data);
      setMessage('Registration failed!');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register Staff</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="username" placeholder="Username" className="w-full p-2 border rounded  bg-white"
          onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" className="w-full p-2 border rounded bg-white"
          onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" className="w-full p-2 border rounded bg-white"
          onChange={handleChange} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
        {message && <p className="text-center text-sm text-gray-700 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterStaff;
