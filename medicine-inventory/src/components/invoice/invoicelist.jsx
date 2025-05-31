import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/invoices/")
      .then(response => {
        setInvoices(response.data);
        setFilteredInvoices(response.data);
      })
      .catch(error => console.error("Error fetching invoices:", error));
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = invoices.filter((invoice) =>
      invoice.customer_name.toLowerCase().includes(term) ||
      (invoice.customer_contact && invoice.customer_contact.includes(term))
    );

    setFilteredInvoices(filtered);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredInvoices(invoices);
  };

  const InvoiceCard = ({ invoice }) => {
    const formattedDate = new Date(invoice.date).toLocaleDateString();
  
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 hover:text-blue-500 transition duration-300">
          {invoice.invoice_number}
        </h2>
        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Customer:</span>{invoice.customer_name}</p>
        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800">Contact:</span> {invoice.customer_contact || "N/A"}</p>
        <p className="text-sm text-gray-600"><span className="font-medium text-gray-800"> Date: </span> {formattedDate}</p>
  
        {/* Medicines List */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Medicines:</p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {invoice.items && invoice.items.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.medicine.name} - {item.quantity} qty @ ₹{item.unit_price}
              </li>
            ))}
          </ul>
        </div>
  
        <p className="text-lg font-bold text-green-700 mt-4">
          Total: ₹ {invoice.total_amount}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-screen-md mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Invoice Listing</h1>

      {/* Search Input and Clear Button */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by customer name or contact number..."
          className="flex-grow px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={clearSearch}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Clear
        </button>
      </div>

      {/* Invoice Cards */}
      <div className="space-y-6">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
