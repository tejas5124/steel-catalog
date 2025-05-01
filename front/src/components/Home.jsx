import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/Home.css";
import bannerImg from "../assets/factorymanav.jpg";
import productListImg from "../assets/productlist.jpeg";
import axios from "axios";

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetching products from your backend API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data); // Assuming API returns an array of products
      } catch (error) {
        console.error("❌ Error fetching products:", error);
      }
    };
    
    fetchProducts();
  }, []);  // Empty dependency array to run this effect only once when the component mounts

  return (
    <div className="home">
      <Header />

      {/* Full-Width Hero Section */}
      <div className="hero">
        <img src={bannerImg} alt="Manav Steel Factory" className="hero-image" />
      </div>

      {/* Split Section: About Us & Product List */}
      <section className="split-section">
        <div className="left">
          <h2>ABOUT US</h2>
          <p>
            Stainless steel is a highly durable and corrosion-resistant alloy
            used in industries like construction, automotive, and manufacturing.
            At Manav Steel & Engineering, we specialize in producing top-quality
            stainless steel products, catering to diverse industrial needs.
            Our commitment to innovation and precision makes us a leading supplier
            in the global market.
          </p>
        </div>
        <div className="right">
          <img src={productListImg} alt="Product Overview" className="product-list-image" />
        </div>
      </section>

      {/* Products Section */}
      <section className="products">
        <h2>OUR PRODUCTS</h2>
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image ? `http://localhost:5000/uploads/images/${product.image}` : "default-image.jpg"}
                  alt={product.name}
                  className="product-image"
                />
                <p>{product.name}</p>
              </div>
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
