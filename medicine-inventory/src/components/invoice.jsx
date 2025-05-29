import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InvoiceForm = () => {
  const [medicines, setMedicines] = useState([]);
  const [items, setItems] = useState([{ medicine_id: '', quantity: 1 }]);
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/medicines/')
      .then(res => setMedicines(res.data))
      .catch(err => console.error("Error fetching medicines:", err));
  }, []);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItem = () => setItems([...items, { medicine_id: '', quantity: 1 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const calculateTotal = () => {
    return items.reduce((acc, item) => {
      const med = medicines.find(m => m.id === parseInt(item.medicine_id));
      const price = med ? Number(med.price) : 0;
      return acc + price * parseInt(item.quantity || 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedItems = items.map(item => ({
      medicine_id: parseInt(item.medicine_id),
      quantity: parseInt(item.quantity)
    }));

    const totalAmount = calculateTotal();

    const payload = {
      customer_name: customerName,
      customer_contact: customerContact,
      total_amount: totalAmount,
      items: cleanedItems
    };

    try {
      const res = await axios.post('http://localhost:8000/api/invoices/create/', payload);
      alert("Invoice created successfully!");

      // Print Window
      const invoiceWindow = window.open('', '_blank');
      const invoiceHTML = `
        <html>
          <head>
            <title>Invoice</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #1E3A8A; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
              th { background-color: #1E3A8A; color: white; }
              tfoot td { font-weight: bold; }
           


            </style>
          </head>
          <body>
          <h1 style="text-align:center;">City Square Cardio Clinic </h1>
            <h1 style="font-size: 26px;">Invoice</h1>
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Contact:</strong> ${customerContact}</p>
            <table>
              <thead>
                <tr>
                  <th>Medicine</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => {
                  const med = medicines.find(m => m.id === parseInt(item.medicine_id));
                  const quantity = parseInt(item.quantity || 0);
                  const price = med ? Number(med.price) : 0;
                  const total = price * quantity;
                  return `
                    <tr>
                      <td>${med?.name || ''}</td>
                      <td>${med?.brand || ''}</td>
                      <td>₹${price.toFixed(2)}</td>
                      <td>${quantity}</td>
                      <td>₹${total.toFixed(2)}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" style="text-align:right;">Total Amount:</td>
                  <td>₹${totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `;
      invoiceWindow.document.write(invoiceHTML);
      invoiceWindow.document.close();

      setCustomerName('');
      setCustomerContact('');
      setItems([{ medicine_id: '', quantity: 1 }]);
    } catch (err) {
      console.error("Error creating invoice:", err.response?.data || err);
      alert("Failed to create invoice.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={e => setCustomerName(e.target.value)}
            className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Customer Contact</label>
          <input
            type="text"
            value={customerContact}
            onChange={e => setCustomerContact(e.target.value)}
            className="mt-1 block w-full p-2 border bg-white border-gray-300 rounded"
          />
        </div>

        {items.map((item, index) => {
          const selectedMed = medicines.find(m => m.id === parseInt(item.medicine_id));
          const price = selectedMed ? selectedMed.price : 0;
          const totalItemPrice = price * parseInt(item.quantity || 0);

          return (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <select
                className="col-span-4 p-2 border bg-white border-gray-300 rounded"
                value={item.medicine_id}
                onChange={e => handleItemChange(index, 'medicine_id', e.target.value)}
                required
              >
                <option value="">Select Medicine</option>
                {medicines.map(med => (
                  <option key={med.id} value={med.id}>
                    {med.name} ({med.brand})
                  </option>
                ))}
              </select>

              <input
                type="number"
                className="col-span-2 p-2 border bg-white border-gray-300 rounded"
                placeholder="Qty"
                value={item.quantity}
                onChange={e => handleItemChange(index, 'quantity', e.target.value)}
                required
                min="1"
              />

              <span className="col-span-3 text-sm text-gray-700">
                Price: ₹{Number(price).toFixed(2)}
              </span>

              <span className="col-span-2 text-sm font-semibold text-green-600">
                ₹{Number(totalItemPrice).toFixed(2)}
              </span>

              <button
                type="button"
                onClick={() => removeItem(index)}
                className="col-span-1 text-red-500 border-black  bg-white hover:underline"
                disabled={items.length === 1}
              >
                ✕
              </button>
            </div>
          );
        })}

        <button
          type="button"
          onClick={addItem}
          className="text-blue-600 hover:underline bg-white border-black"
        >
          + Add another medicine
        </button>

        <div className="text-right text-xl font-bold  text-blue-700 pt-4">
          Total: ₹{calculateTotal().toFixed(2)}
        </div>

        <button
          type="submit"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded  hover:bg-blue-700"
        >
          Submit Invoice
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;
