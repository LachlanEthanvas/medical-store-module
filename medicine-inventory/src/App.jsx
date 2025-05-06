import React from 'react';
import './components/style.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MedicineInventory from './components/MedicineInventory';
import StockInventory from './components/stock';
import Navbar from './components/Navbar'; // Import Navbar
import SupplierRegisterForm from './components/supplier/Supplierregister';
import LoginForm from './components/supplier/supplierLogin';
import Dashboard from './components/supplier/SupplierDashboard';
import InvoiceForm from './components/invoice'; // Import InvoicePage
import InvoiceList from './components/invoicelist'; // Import InvoiceList
import RegisterStaff from './components/staffregistration';
import StaffLogin from './components/loginstaff'; // Import StaffLogin


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar /> {/* Add Navbar component here */}
        <Routes>
          <Route path="/" element={<MedicineInventory />} />
        
          <Route path="/register" element={<SupplierRegisterForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<StockInventory />} />
          <Route path="/invoice" element={<InvoiceForm />} />
          <Route path="/invoicelist" element={< InvoiceList/>} />
          <Route path="/RegisterStaff" element={< RegisterStaff/>} />
          <Route path="/StaffLogin" element={< StaffLogin/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
