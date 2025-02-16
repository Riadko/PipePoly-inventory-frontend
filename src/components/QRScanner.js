import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from 'axios';
import './QRScanner.css'; // Import the CSS file

const QRScanner = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [showScanAnother, setShowScanAnother] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      facingMode: { exact: "environment" } // Use the main camera by default
    });

    scanner.render(
      async (decodedText) => {
        try {
          const response = await axios.get(`https://pipepoly-inventory-backend.onrender.com/items/${decodedText}`);
          setResult(response.data);
          setError(""); // Clear any previous error
          setShowScanAnother(true);
          scanner.clear(); // Stop scanning after success
        } catch (err) {
          setError("Product not found");
          setResult(null); // Clear any previous result
          setShowScanAnother(true);
        }
      },
      (errorMessage) => {
        console.warn(errorMessage);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  const handleScanAnother = () => {
    setResult(null);
    setError("");
    setShowScanAnother(false);
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      facingMode: { exact: "environment" } // Use the main camera by default
    });
    scanner.render(
      async (decodedText) => {
        try {
          const response = await axios.get(`https://pipepoly-inventory-backend.onrender.com/items/${decodedText}`);
          setResult(response.data);
          setError(""); // Clear any previous error
          setShowScanAnother(true);
          scanner.clear(); // Stop scanning after success
        } catch (err) {
          setError("Product not found");
          setResult(null); // Clear any previous result
          setShowScanAnother(true);
        }
      },
      (errorMessage) => {
        console.warn(errorMessage);
      }
    );
  };

  const handleIncrement = () => {
    setResult((prevResult) => ({
      ...prevResult,
      quantity: prevResult.quantity + 1,
    }));
  };

  const handleDecrement = () => {
    setResult((prevResult) => ({
      ...prevResult,
      quantity: Math.max(prevResult.quantity - 1, 0),
    }));
  };

  const handleSaveQuantity = async () => {
    if (!result) return;

    try {
      const response = await axios.put(`https://pipepoly-inventory-backend.onrender.com/items/${result.qr_code}`, {
        name: result.name,
        quantity: result.quantity,
        description: result.description,
        image_url: result.image_url,
      });

      if (response.status === 200) {
        alert("Quantity updated successfully");
      } else {
        console.error('Error updating quantity:', response);
        alert("Failed to update quantity");
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert("Failed to update quantity");
    }
  };

  const handleDeleteProduct = async () => {
    if (!result) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${result.name}?`);
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://pipepoly-inventory-backend.onrender.com/items/${result.qr_code}`);

      if (response.status === 200) {
        setResult(null);
        setShowScanAnother(true);
        alert("Product deleted successfully");
      } else {
        console.error('Error deleting product:', response);
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="container">
      <h2>Scan QR Code</h2>
      <div id="reader"></div>
      {error && <p className="error-message">{error}</p>}
      {result && (
        <div className="result-container">
          <img src={result.image_url} alt={result.name} />
          <h3>{result.name}</h3>
          <p>Quantity: {result.quantity}</p>
          {result.description && <p>Description: {result.description}</p>}
          <div className="quantity-controls">
            <button onClick={handleDecrement}>-</button>
            <span>{result.quantity}</span>
            <button onClick={handleIncrement}>+</button>
          </div>
          <button onClick={handleSaveQuantity} className="save-button">Save</button>
          <button onClick={handleDeleteProduct} className="delete-button">Delete</button>
        </div>
      )}
      {showScanAnother && (
        <>
          {error && <p className="error-message">{error}</p>}
          <button onClick={handleScanAnother} className="scan-another-button">Scan Another Product</button>
        </>
      )}
    </div>
  );
};

export default QRScanner;