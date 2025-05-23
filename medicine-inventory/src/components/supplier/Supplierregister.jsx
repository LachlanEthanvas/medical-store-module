import { useState } from "react";
import axios from "axios";

const SupplierRegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
    contact_number: "",
    gst: "", // New GST field
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/supplier-register/",
        formData
      );
      setMessage(response.data.message);
      setFormData({
        username: "",
        email: "",
        password: "",
        address: "",
        contact_number: "",
        gst: "", // Reset GST field
      });
    } catch (error) {
      setMessage("Registration failed. " + JSON.stringify(error.response.data));
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-md mx-auto border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Supplier Registration</h2>

      {message && <p className="mb-3 text-red-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="">Username:</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        <label htmlFor="">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        <label htmlFor="">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        <label htmlFor="">Address:</label>
        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        ></textarea>
        <label htmlFor="">Contact number:</label>
        <input
          type="text"
          name="contact_number"
          placeholder="Contact Number"
          value={formData.contact_number}
          onChange={handleChange}
          required
          className="border p-2 w-full bg-white"
        />
        <label htmlFor="">GST number:</label>
        <input
          type="text"
          name="gst"
          placeholder="GST Number"
          value={formData.gst}
          onChange={handleChange}
          className="border p-2 w-full bg-white"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default SupplierRegisterForm;
