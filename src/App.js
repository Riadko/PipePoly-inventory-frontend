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
        <img src={`${process.env.PUBLIC_URL}/logoBlack.png`} alt="Logo" className="logo" />
        <h1>Gestion des stocks</h1>
        <nav>
          <Link to="/">Accueil</Link>
          <Link to="/scan">QR code</Link>
          <Link to="/add-product">Ajouter produit</Link>
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
