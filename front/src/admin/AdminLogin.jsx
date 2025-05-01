import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminLogin.css";
import factoryImage from "../assets/prosolutions.jpg";
import googleIcon from "../assets/google-icon.jpeg";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    setError("");
  };

  const saveAdmin = (admin, token) => {
    localStorage.setItem("admin", JSON.stringify(admin));
    localStorage.setItem("token", token);
  };

  const loginAdmin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/admin/login", {
        username: formData.username,
        password: formData.password,
      });
  
      const { admin, token } = response.data;
      saveAdmin(admin, token);
  
      console.log("✅ Admin logged in:", admin);
      console.log("✅ Token received:", token);
  
      // Navigate using admin ID
      navigate(`/admin/${admin.id}/dashboard`);
    } catch (err) {
      console.error("❌ Login Error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };
  
  const registerAdmin = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/admin/register", {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      alert(response.data.message);
      setIsRegister(false);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      const { name, username, email, password, confirmPassword } = formData;
      if (!name || !username || !email || !password || !confirmPassword) {
        setError("All fields are required.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      registerAdmin();
    } else {
      if (!formData.username || !formData.password) {
        setError("Username and password are required.");
        return;
      }
      loginAdmin();
    }
  };

  return (
    <>
      <Header />
      <div className="admin-container">
        {/* Left Side: Login/Register */}
        <div className="admin-form-container">
          <div className="admin-form-box">
            <h2>{isRegister ? "Admin Register" : "Admin Login"}</h2>

            {/* Toggle Between Login & Register */}
            <div className="toggle-container">
              <button className={!isRegister ? "active" : ""} onClick={() => { setIsRegister(false); setError(""); }}>
                Log In
              </button>
              <button className={isRegister ? "active" : ""} onClick={() => { setIsRegister(true); setError(""); }}>
                Register
              </button>
            </div>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              {isRegister && <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />}
              <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
              {isRegister && <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />}
              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              {isRegister && <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />}
              <button type="submit">{isRegister ? "Register" : "Log In"}</button>
            </form>

            <p className="or-text">OR</p>

            <button className="google-login-btn">
              <img src={googleIcon} alt="Google" />
              <p>Continue with Google</p>
            </button>

            <Link to="/" className="back-to-home">← Back to Home</Link>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="admin-image-container">
          <img src={factoryImage} alt="Manav Factory" />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminLogin;
