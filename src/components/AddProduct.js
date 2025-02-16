import React, { useState, useCallback, useRef } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';
import { useDropzone } from 'react-dropzone';
import Webcam from 'react-webcam';
import './AddProduct.css'; // Import the CSS file

const AddProduct = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [message, setMessage] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const webcamRef = useRef(null);

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

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'JPEG',
      100,
      0,
      (uri) => {
        setImageUrl(uri);
      },
      'base64'
    );
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageUrl(imageSrc);
    setShowWebcam(false);
  }, [webcamRef]);

  return (
    <div>
      <h2>Ajouter un produit</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Nom du produit'
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder='Quantité'
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
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Glissez-déposez une image ou cliquez pour en choisir une.</p>
        </div>
        <button type="button" onClick={() => setShowWebcam(true)}>Prendre une photo</button>
        {showWebcam && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
              height={300}
              videoConstraints={{
                facingMode: { exact: "environment" } // Use rear camera
              }}
            />
            <button type="button" onClick={capture}>Capturer photo</button>
          </div>
        )}
        {imageUrl && <img src={imageUrl} alt="Product" style={{ width: '100px', height: '100px' }} />}
        <button type="submit">Ajouter le produit</button>
      </form>
    </div>
  );
};

export default AddProduct;