import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          navigate("/login");
          return;
        }

        const userResponse = await axios.get("http://127.0.0.1:8000/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);

        const medicineResponse = await axios.get("http://127.0.0.1:8000/api/supplier/medicines/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMedicines(medicineResponse.data);
      } catch (error) {
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* User Details Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Supplier Dashboard</h2>

        {user ? (
          <div className="border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-700">Welcome, {user.username}!</h3>
            <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
            <p className="text-gray-600"><strong>Address:</strong> {user.address}</p>
          </div>
        ) : (
          <p className="text-gray-500">Loading user details...</p>
        )}
      </div>

      {/* Medicine Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Your Medicines</h3>

        {medicines.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="py-2 px-4 border">#</th>
                  <th className="py-2 px-4 border">Medicine Name</th>
                  <th className="py-2 px-4 border">Brand</th>
                  <th className="py-2 px-4 border">Stock</th>
                  <th className="py-2 px-4 border">Price</th>
                  <th className="py-2 px-4 border">Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine, index) => (
                  <tr key={medicine.id} className="text-gray-700 text-center border-t">
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border font-semibold">{medicine.name}</td>
                    <td className="py-2 px-4 border">{medicine.brand}</td>
                    <td className="py-2 px-4 border">{medicine.stock_quantity}</td>
                    <td className="py-2 px-4 border">₹{medicine.price}</td>
                    <td className="py-2 px-4 border">{medicine.expiry_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No medicines found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
