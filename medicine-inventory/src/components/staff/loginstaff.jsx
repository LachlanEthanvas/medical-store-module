// StaffLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StaffLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
  
    axios.post('http://localhost:8000/api/token/', {
      username,
      password,
    })
    .then((res) => {
      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;
  
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
  
      // Fetch staff name
      axios.get('http://localhost:8000/api/staff/profile/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((profileRes) => {
  localStorage.setItem('staff_name', profileRes.data.username);
  navigate('/');              // Navigate to inventory
  setTimeout(() => {
    window.location.reload();      // Force navbar update after a short delay
  }, 100);
})

      .catch((err) => {
        console.error("Profile fetch failed", err);
        navigate('/');
      });
    })
    .catch((err) => {
      alert('Login failed. Please check credentials.');
      console.error(err);
    });
  };
  
  return (
    <div className="flex items-center justify-center ">
      <form className="bg-white p-10 rounded shadow-lg w-[500px]" onSubmit={handleLogin}>
        <h2 className="text-2xl mb-4 font-semibold">Staff Login</h2>
        <label htmlFor="">Username:</label>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded bg-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="">Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded bg-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>
      </form>
    </div>
  );
};

export default StaffLogin;
