import React, { useEffect, useState } from "react";
import axios from "axios";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/invoices/")
      .then(response => setInvoices(response.data))
      .catch(error => console.error("Error fetching invoices:", error));
  }, []);

  const InvoiceCard = ({ invoice }) => {
    const formattedDate = new Date(invoice.date).toLocaleDateString();

    return (
      <div className="bg-white rounded-lg shadow-md p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          {invoice.invoice_number}
        </h2>
        <p className="text-sm text-gray-600">Customer: {invoice.customer_name}</p>
        <p className="text-sm text-gray-600">Contact: {invoice.customer_contact || "N/A"}</p>
        <p className="text-sm text-gray-600">Date: {formattedDate}</p>
        <p className="text-sm font-semibold text-green-700 mt-2">
          ₹ {invoice.total_amount}
        </p>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Invoice Listing</h1>
      <div className="flex flex-wrap gap-6">
        {invoices.length > 0 ? (
          invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))
        ) : (
          <p className="text-gray-500">No invoices found.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
