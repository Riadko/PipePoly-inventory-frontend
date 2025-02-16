import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import './Home.css'; // Import the CSS file
import './Modal.css'; // Import the Modal CSS file

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/items');
        setProducts(response.data);
        setAllProducts(response.data); // Store all products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setProducts(allProducts); // Reset to all products if search term is empty
    } else {
      const filteredProducts = allProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  }, [searchTerm, allProducts]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalVisible(false);
  };

  const handleIncrement = () => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      quantity: prevProduct.quantity + 1,
    }));
  };

  const handleDecrement = () => {
    setSelectedProduct((prevProduct) => ({
      ...prevProduct,
      quantity: Math.max(prevProduct.quantity - 1, 0),
    }));
  };

  const handleSaveQuantity = async () => {
    if (!selectedProduct) return;

    try {
      const response = await axios.put(`http://localhost:5000/items/${selectedProduct.qr_code}`, {
        name: selectedProduct.name,
        quantity: selectedProduct.quantity,
        description: selectedProduct.description,
        image_url: selectedProduct.image_url,
      });

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.qr_code === selectedProduct.qr_code
              ? { ...product, quantity: selectedProduct.quantity }
              : product
          )
        );
        setIsModalVisible(false);
      } else {
        console.error('Error updating quantity:', response);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedProduct.name}?`);
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/items/${selectedProduct.qr_code}`);

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.qr_code !== selectedProduct.qr_code)
        );
        setIsModalVisible(false);
      } else {
        console.error('Error deleting product:', response);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Calculate the products to display based on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle change in products per page
  const handleProductsPerPageChange = (e) => {
    setProductsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  return (
    <div className="container">
      <h2>Inventory List</h2>
      <div className="search-add-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="add-product-container">
          <Link to="/add-product">
            <button>Add Product</button>
          </Link>
        </div>
      </div>
      <div className="pagination-controls">
        <label htmlFor="productsPerPage">Products per page:</label>
        <select id="productsPerPage" value={productsPerPage} onChange={handleProductsPerPageChange}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>QR Code</th>
            <th>Description</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <tr key={product.id} onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                  <div className="qr-code-wrapper">
                    <QRCodeCanvas value={product.qr_code || ''} size={100} />
                  </div>
                </td>
                <td>{product.description || 'No description'}</td>
                <td>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} width="100" />
                  ) : (
                    'No image'
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination
        productsPerPage={productsPerPage}
        totalProducts={products.length}
        paginate={paginate}
        currentPage={currentPage}
      />

      {isModalVisible && selectedProduct && (
        <div className="modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={handleCloseModal}>&times;</span>
            <div className="product-info">
              <img src={selectedProduct.image_url} alt={selectedProduct.name} />
              <h3>{selectedProduct.name}</h3>
              <p>Quantity: {selectedProduct.quantity}</p>
              <div className="quantity-controls">
                <button onClick={handleDecrement}>-</button>
                <span>{selectedProduct.quantity}</span>
                <button onClick={handleIncrement}>+</button>
              </div>
              <p>Description: {selectedProduct.description}</p>
              <QRCodeCanvas value={selectedProduct.qr_code || ''} size={100} />
              <br></br>
              <button onClick={handleDeleteProduct} className="delete-button">Delete</button>
              <button onClick={handleSaveQuantity} className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href="#" className="page-link">
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Home;