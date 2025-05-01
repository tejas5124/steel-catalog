import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewProduct.css";
import AdminSidebar from "./AdminSidebar";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="view-product-container">
      <AdminSidebar />

      <div className="content">
        <h2>Product List</h2>

        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{new Date(product.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedProduct(product)} className="view-btn">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No products found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="product-details-overlay">
            <div className="product-details">
              <div className="details-text">
                <h3>Product Details</h3>
                <p><strong>ID:</strong> {selectedProduct.id}</p>
                <p><strong>Admin ID:</strong> {selectedProduct.admin_id}</p>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
                <p><strong>Grade:</strong> {selectedProduct.grade}</p>
                <p><strong>Thickness:</strong> {selectedProduct.thickness} mm</p>
                <p><strong>Weight:</strong> {selectedProduct.weight} kg</p>
                <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
                <p><strong>Location:</strong> {selectedProduct.location}</p>
                <p><strong>Manufacturer:</strong> {selectedProduct.manufacturer}</p>
                <p><strong>Certification:</strong> {selectedProduct.certification}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Created At:</strong> {new Date(selectedProduct.created_at).toLocaleString()}</p>
              </div>

              <div className="details-image">
                {selectedProduct.image && (
                  <img
                    src={`http://localhost:5000/uploads/images/${selectedProduct.image}`}
                    alt="Product"
                  />
                )}
                <button className="close-btn" onClick={() => setSelectedProduct(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProduct;
