import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ManageProduct.css";
import AdminSidebar from "./AdminSidebar";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Authorization required!");

      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("❌ Error deleting product:", error);
      alert("❌ Failed to delete product");
    }
  };

  const handleUpdate = (product) => {
    setSelectedProduct({ ...product });
    setImage(null);
  };

  const handleProductChange = (e) => {
    setSelectedProduct({ ...selectedProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const formData = new FormData();
      Object.keys(selectedProduct).forEach((key) => formData.append(key, selectedProduct[key]));
      if (image) formData.append("image", image);

      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in to update the product.");

      await axios.put(`http://localhost:5000/api/products/${selectedProduct.id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product updated successfully!");
      fetchProducts();
      setSelectedProduct(null);
      setImage(null);
    } catch (error) {
      console.error("❌ Error updating product:", error);
      alert("❌ Failed to update product");
    }
  };

  return (
    <div className="manage-product-container">
      <AdminSidebar />
      <div className="content">
        <h2>Manage Products</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>View</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => setViewProduct(product)}>View</button>
                  </td>
                  <td>
                    <button onClick={() => handleUpdate(product)}>Update</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>

        {selectedProduct && (
  <div className="update-form-container">
    <h3>Update Product</h3>
    <form onSubmit={handleSubmitUpdate}>
      {Object.keys(selectedProduct).map((key) => {
        if (key === "id" || key === "admin_id" || key === "created_at" || key === "image") return null;
        return (
          <div className="form-group" key={key}>
            <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type="text"
              name={key}
              value={selectedProduct[key]}
              onChange={handleProductChange}
              required
            />
          </div>
        );
      })}

      {/* Display Existing Product Image */}
      {selectedProduct.image && (
        <div className="form-group image-preview">
          <label>Existing Image</label>
          <img
            src={`http://localhost:5000/uploads/images/${selectedProduct.image}`}
            alt="Product"
            className="product-preview-image"
          />
        </div>
      )}

      {/* Product Image Upload */}
      <div className="form-group image-upload">
        <label>Upload New Image</label>
        <input type="file" onChange={handleImageChange} />
      </div>

      <div className="button-group">
        <button type="submit" className="update-button">Update Product</button>
        <button onClick={() => setSelectedProduct(null)} className="close-button">Close</button>
      </div>
    </form>
  </div>
)}




        {viewProduct && (
          <div className="product-details-overlay">
            <div className="product-details">
              <div>
                <h3>Product Details</h3>
                {Object.keys(viewProduct).map(
                  (key) =>
                    key !== "image" && (
                      <p key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {viewProduct[key]}
                      </p>
                    )
                )}
              </div>

              <div>
                {viewProduct.image && (
                  <img
                    src={`http://localhost:5000/uploads/images/${viewProduct.image}`}
                    alt="Product"
                  />
                )}
                <button className="close-button" onClick={() => setViewProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageProduct;
