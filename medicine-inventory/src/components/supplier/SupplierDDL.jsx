import { useState, useEffect } from "react";
import axios from "axios";

const SupplierDropdown = ({ selectedSupplier, onSelect }) => {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/suppliers/");
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  return (
    <select
      className="border p-3 w-full mb-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedSupplier || ""}
      onChange={(e) => onSelect(e.target.value)}
    >
      <option value="">Select a Supplier</option>
      {suppliers.map((supplier) => (
        <option key={supplier.id} value={supplier.id}>
          {supplier.username}
        </option>
      ))}
    </select>
  );
};

export default SupplierDropdown;
