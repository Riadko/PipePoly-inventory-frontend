import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the product details, including description and image_url
      await axios.post('https://pipepoly-inventory-backend.onrender.com/items', {
        name,
        quantity: parseInt(quantity, 10),
        qr_code: "",  // We send an empty string so the backend will generate a QR code
        description,
        image_url: imageUrl
      });

      setMessage('Product added successfully!');
      setName('');
      setQuantity('');
      setDescription('');
      setImageUrl('');
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage('Error adding product.');
    }
  };

  return (
    <div>
      <h2>Add New Product</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Product Name'
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder='Quantity'
            required
          />
        </div>
        
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Description'
          />
        </div>
        <div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder='Image URL'
          />
        </div>
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
