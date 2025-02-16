import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home';
import QRScanner from './components/QRScanner';
import AddProduct from './components/AddProduct';
import './App.css'; // Import the CSS file

const App = () => {
  return (
    <Router>
      <div className="container">
        <h1>Inventory Management</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/scan">Scan QR Code</Link>
          <Link to="/add-product">Add Product</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<QRScanner />} />
          <Route path="/add-product" element={<AddProduct />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
