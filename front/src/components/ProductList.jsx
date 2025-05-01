import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ProductList.css";
import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quotation, setQuotation] = useState([]);
  const [message, setMessage] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    const escHandler = (e) => {
      if (e.key === "Escape") setSelectedProduct(null);
    };
    window.addEventListener("keydown", escHandler);
    return () => window.removeEventListener("keydown", escHandler);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery)
  );

  const addToQuotation = (product) => {
    setQuotation((prev) => {
      // Check if the product is already in the quotation
      const index = prev.findIndex((item) => item.id === product.id);
      if (index !== -1) {
        // If the product is already in the quotation, don't add it again
        showMessage(`${product.name} is already added to the quotation.`);
        return prev;
      }
      // Add new product with quantity set to 1
      showMessage(`${product.name} added to quotation.`);
      return [...prev, { ...product, quantity: 1, totalPrice: Number(product.price) }];
    });
  };

  const removeFromQuotation = (productId) => {
    const removedProduct = quotation.find((item) => item.id === productId);
    setQuotation((prev) => prev.filter((item) => item.id !== productId));
    if (removedProduct) showMessage(`${removedProduct.name} removed from quotation.`);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0 || isNaN(newQuantity)) return; // Prevent invalid input
    setQuotation((prev) => {
      const updated = prev.map((item) => {
        if (item.id === productId) {
          item.quantity = newQuantity;
          item.totalPrice = item.quantity * item.price;
        }
        return item;
      });
      return updated;
    });
  };

  const showMessage = (text) => {
    setMessage(text);
    setFadeOut(false);
    setTimeout(() => setFadeOut(true), 1500);
    setTimeout(() => {
      setMessage("");
      setFadeOut(false);
    }, 2000);
  };

  const getTotalPrice = () => {
    return quotation.reduce((acc, item) => acc + Number(item.totalPrice), 0);
  };

  const handleSendQuotation = () => {
    navigate("/send-quotation", { state: { quotation } });
  };

  const closeModal = (e) => {
    if (e.target.classList.contains("product-details-modal")) {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="product-list-container">
      <Header />

      {message && (
        <div className={`message-box ${fadeOut ? "fade-out" : ""}`}>
          {message}
        </div>
      )}

      <header className="product-header">
        <h1>Steel Products</h1>
        <input
          type="text"
          placeholder="Search Products..."
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
        />
      </header>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image ? `http://localhost:5000/uploads/images/${product.image}` : "default-image.jpg"}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">{product.category}</p>
                <p className="product-price">₹{product.price}</p>
                <p className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                </p>
              </div>
              <button onClick={() => setSelectedProduct(product)} className="view-details-btn">View Details</button>
              <button onClick={() => addToQuotation(product)} className="add-to-quotation-btn">Add to Quotation</button>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {selectedProduct && (
        <div className="product-details-modal" onClick={closeModal}>
          <div className="modal-content">
            <div className="modal-left">
              <h2>Product Details</h2>
              <p><strong>Name:</strong> {selectedProduct.name}</p>
              <p><strong>Category:</strong> {selectedProduct.category}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Stock:</strong> {selectedProduct.stock}</p>
              <p><strong>Grade:</strong> {selectedProduct.grade}</p>
              <p><strong>Thickness:</strong> {selectedProduct.thickness} mm</p>
              <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
              <p><strong>Location:</strong> {selectedProduct.location}</p>
              <p><strong>Manufacturer:</strong> {selectedProduct.manufacturer}</p>
              <p><strong>Certification:</strong> {selectedProduct.certification}</p>
              <p><strong>Added On:</strong> {new Date(selectedProduct.created_at).toLocaleString()}</p>
              <button className="close-btn" onClick={() => setSelectedProduct(null)}>Close</button>
            </div>
            <div className="modal-right">
              <img
                src={selectedProduct.image ? `http://localhost:5000/uploads/images/${selectedProduct.image}` : "default-image.jpg"}
                alt={selectedProduct.name}
                className="modal-image"
              />
            </div>
          </div>
        </div>
      )}

      {quotation.length > 0 && (
        <div className="quotation-table-container">
          <h2>Quotation</h2>
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quotation.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                      min="1"
                      max={item.stock}
                      className="quantity-input"
                    />
                  </td>
                  <td>₹{item.totalPrice}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromQuotation(item.id)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="quotation-summary">
            <p><strong>Total Products:</strong> {quotation.length}</p>
            <p><strong>Total Price:</strong> ₹{getTotalPrice()}</p>
          </div>

          <button className="send-quotation-btn" onClick={handleSendQuotation}>Send Quotation</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductList;
