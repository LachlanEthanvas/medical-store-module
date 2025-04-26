import React, { useState, useEffect } from "react";
import axios from "axios";

const StockInventory = () => {
  const todayDate = new Date().toISOString().split("T")[0];
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMedicines();
    fetchCategories();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/medicines/");
      setMedicines(response.data);
    } catch (error) {
      setError("Error fetching medicines");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(response.data);
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  const updateStock = async (id, change) => {
    setLoading(true);
    setError("");
    try {
      const medicine = medicines.find((med) => med.id === id);
      const updatedStock = Math.max(medicine.stock_quantity + change, 0);
      await axios.patch(`http://127.0.0.1:8000/api/medicines/${id}/`, {
        stock_quantity: updatedStock,
      });
      fetchMedicines();
    } catch (error) {
      setError("Error updating stock");
    } finally {
      setLoading(false);
    }
  };

  // Function to get category name from category ID
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown"; // Fallback in case category is missing
  };

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-700 mb-6">
        Medicine Inventory
      </h1>

      <div className="w-full lg:w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Medicine List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto shadow-md rounded-lg bg-white">
            <table className="table-auto w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Brand</th>
                  <th className="px-4 py-2 text-left">Category</th>
                  <th className="px-4 py-2 text-left">Stock Quantity</th>
                  <th className="px-4 py-2 text-left">Price</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td className="px-4 py-2">{medicine.name}</td>
                    <td className="px-4 py-2">{medicine.brand}</td>
                    <td className="px-4 py-2">{getCategoryName(medicine.category)}</td>
                    <td className="px-4 py-2">{medicine.stock_quantity}</td>
                    <td className="px-4 py-2">{medicine.price}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded-lg mr-2"
                        onClick={() => updateStock(medicine.id, 1)}
                      >
                        +
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-lg"
                        onClick={() => updateStock(medicine.id, -1)}
                      >
                        -
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockInventory;
