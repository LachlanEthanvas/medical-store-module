import React, { useState, useEffect } from "react";
import axios from "axios";
import SupplierDropdown from "./supplier/SupplierDDL";

const MedicineInventory = () => {
  const todayDate = new Date().toISOString().split("T")[0];
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    brand: "",
    category: "",
    supplier: "",
    description: "",
    price: "",
    expiry_date: todayDate,
    stock_quantity: "",
    dose: "",
    dose_measurement: "mg", // Default dose measurement
  });
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState(""); // State to hold the new category

  useEffect(() => {
    fetchMedicines();
    fetchCategories(); // Fetch categories when component mounts
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/medicines/");
      setMedicines(response.data);
    } catch (error) {
      setError("Error fetching medicines", error);
    } finally {
      setLoading(false);
    }
  };
  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown"; // Fallback in case category is missing
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories/");
      setCategories(response.data); // Store categories in state
    } catch (error) {
      setError("Error fetching categories");
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError("");
    try {
      if (newCategory) {
        // If there's a new category, send it to the backend
        await axios.post("http://127.0.0.1:8000/api/categories/", { name: newCategory });
        fetchCategories(); // Refresh the categories list after adding the new category
        setNewCategory(""); // Reset the new category field
        setShowAddCategory(false); // Hide the add category form after submission
      }
  
      // Add the new medicine after potentially adding a new category
      await axios.post("http://127.0.0.1:8000/api/medicines/", newMedicine);
      fetchMedicines();
      resetForm();
    } catch (error) {
      setError("Error creating medicine");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/medicines/${editingMedicine.id}/`,
        editingMedicine
      );
      fetchMedicines();
      setEditingMedicine(null);
    } catch (error) {
      setError("Error updating medicine");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.delete(`http://127.0.0.1:8000/api/medicines/${id}/`);
      fetchMedicines();
    } catch (error) {
      setError("Error deleting medicine");
    } finally {
      setLoading(false);
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setNewMedicine({
      name: "",
      brand: "",
      category: "",
      supplier: "",
      description: "",
      price: "",
      expiry_date: todayDate,
      stock_quantity: "",
      dose: "",
      dose_measurement: "mg", // Reset to default dose measurement
    });
  };
  return (
    <div className="container p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-700 mb-6">
        Medicine Inventory
      </h1>

      {/* Form for adding/editing medicines and list of medicines side by side */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Add/Edit Medicine Form */}
        <div className="bg-white border-r-4 border-black p-2 w-full lg:w-2/5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {editingMedicine ? "Edit Medicine" : "Add Medicine"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="name">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                placeholder="Enter medicine name"
                value={editingMedicine ? editingMedicine.name : newMedicine.name}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, name: e.target.value })
                    : setNewMedicine({ ...newMedicine, name: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="brand">
                Brand <span className="text-red-500">*</span>
              </label>
              <input
                id="brand"
                type="text"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                placeholder="Enter brand"
                value={editingMedicine ? editingMedicine.brand : newMedicine.brand}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, brand: e.target.value })
                    : setNewMedicine({ ...newMedicine, brand: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="category">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 w-full sm:w-64 px-4"
                value={editingMedicine ? editingMedicine.category : newMedicine.category}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, category: e.target.value })
                    : setNewMedicine({ ...newMedicine, category: e.target.value })
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
             {/* Button to show/hide new category form */}
<div className="flex flex-col mt-4">
  <button
    type="button"
    className="btn-small w-8 h-8 flex items-center justify-center  "
    onClick={() => setShowAddCategory(!showAddCategory)} // Toggle visibility
  >
    + 
  </button>

  {/* Conditionally render the category form */}
  {showAddCategory && (
    <div className="flex flex-col mt-4">
      <label className="text-gray-600 font-medium mb-2" htmlFor="new-category">
        Enter New Category Name
      </label>
      <input
        id="new-category"
        type="text"
        className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
        placeholder="Enter new category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)} // Set new category state
      />
      <button
        type="button"
        className="bg-green-500 text-white py-2 px-4 rounded-lg mt-4"
        onClick={handleCreate} // Function to create category and add medicine
      >
        Submit Category
      </button>
    </div>
  )}
</div>

            </div>
            
            <div className="flex flex-col">
              <label className="block mb-2">Select Supplier:</label>
              <SupplierDropdown 
  selectedSupplier={editingMedicine ? editingMedicine.supplier : newMedicine.supplier}
  onSelect={(supplierId) => {
    if (editingMedicine) {
      setEditingMedicine(prev => ({ ...prev, supplier: supplierId }));
    } else {
      setNewMedicine(prev => ({ ...prev, supplier: supplierId }));
    }
  }} 
/>

            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2  w-full sm:w-64 px-4"
                placeholder="Enter description"
                value={editingMedicine ? editingMedicine.description : newMedicine.description}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, description: e.target.value })
                    : setNewMedicine({ ...newMedicine, description: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="price">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                type="number"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                placeholder="Enter price"
                value={editingMedicine ? editingMedicine.price : newMedicine.price}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, price: e.target.value })
                    : setNewMedicine({ ...newMedicine, price: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="expiry_date">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <input
                id="expiry_date"
                type="date"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                value={editingMedicine ? editingMedicine.expiry_date : newMedicine.expiry_date}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, expiry_date: e.target.value })
                    : setNewMedicine({ ...newMedicine, expiry_date: e.target.value })
                }
                min={todayDate}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="stock_quantity">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                id="stock_quantity"
                type="number"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                placeholder="Enter stock quantity"
                value={editingMedicine ? editingMedicine.stock_quantity : newMedicine.stock_quantity}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, stock_quantity: e.target.value })
                    : setNewMedicine({ ...newMedicine, stock_quantity: e.target.value })
                }
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="dose">
                Dose <span className="text-red-500">*</span>
              </label>
              <input
                id="dose"
                type="number"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                placeholder="Enter dose amount"
                value={editingMedicine ? editingMedicine.dose : newMedicine.dose}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, dose: e.target.value })
                    : setNewMedicine({ ...newMedicine, dose: e.target.value })
                }
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-gray-600 font-medium mb-2" htmlFor="dose_measurement">
                Dose Measurement <span className="text-red-500">*</span>
              </label>
              <select
                id="dose_measurement"
                className="input bg-gray-300 border border-gray-300 rounded-lg py-2 px-4 w-full sm:w-64"
                value={editingMedicine ? editingMedicine.dose_measurement : newMedicine.dose_measurement}
                onChange={(e) =>
                  editingMedicine
                    ? setEditingMedicine({ ...editingMedicine, dose_measurement: e.target.value })
                    : setNewMedicine({ ...newMedicine, dose_measurement: e.target.value })
                }
                required
              >
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="mcg">mcg</option>
                <option value="mL">mL</option>
                <option value="L">L</option>
                <option value="IU">IU</option>
                <option value="U">U</option>
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="gtt">gtt</option>
                <option value="puff">puff</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg"
              onClick={editingMedicine ? handleUpdate : handleCreate}
            >
              {editingMedicine ? "Update Medicine" : "Add Medicine"}
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              onClick={() => {
                setEditingMedicine(null);
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* List of Medicines */}
        <div className="w-full lg:w-3/5">
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
                          className="bg-yellow-500 text-white py-1 px-4 rounded-lg"
                          onClick={() => setEditingMedicine(medicine)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white py-1 px-4 rounded-lg ml-2"
                          onClick={() => handleDelete(medicine.id)}
                        >
                          Delete
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
    </div>
  );
};

export default MedicineInventory; 