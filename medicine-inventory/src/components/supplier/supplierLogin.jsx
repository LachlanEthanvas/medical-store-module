import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", credentials);
      localStorage.setItem("access_token", response.data.access);  // Store JWT token
      localStorage.setItem("refresh_token", response.data.refresh);
      navigate("/dashboard");  // Redirect to the dashboard after successful login
    } catch (error) {
      setMessage("Login failed: " + JSON.stringify(error.response.data));
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Supplier Login</h2>

      {message && <p className="mb-3 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        
        <label htmlFor="">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
