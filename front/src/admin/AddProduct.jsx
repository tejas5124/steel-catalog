import axios from "axios";
import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import "../styles/AddProduct.css"; // Import CSS file

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    grade: "",
    thickness: "",
    weight: "",
    price: "",
    location: "",
    manufacturer: "",
    certification: "",
    stock: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert("❌ Please upload an image.");
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5000/api/products", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);

      setFormData({
        name: "",
        category: "",
        grade: "",
        thickness: "",
        weight: "",
        price: "",
        location: "",
        manufacturer: "",
        certification: "",
        stock: "",
        image: null,
      });
    } catch (error) {
      console.error("❌ Error adding product:", error);
      alert(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <div className="add-product-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Thickness (mm)</label>
              <input type="number" name="thickness" value={formData.thickness} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Grade</label>
              <input type="text" name="grade" value={formData.grade} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Manufacturer</label>
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Certification</label>
            <input type="text" name="certification" value={formData.certification} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input type="number" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>

          <div className="form-row">
            <div className="form-group image-input">
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleFileChange} required />
            </div>

            <div className="form-group">
              <button type="submit" className="submit-btn">Add Product</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
