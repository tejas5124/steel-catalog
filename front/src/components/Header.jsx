import React from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/prosolutions.jpg"; // Ensure the path is correct

const Header = () => {
  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src={logo} alt="Manav Steel" />
        </Link>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Our Products</Link></li>
          <li><Link to="/send-quotation">Send Quotation</Link></li> 
          <li className="admin-login">
            <Link to="/admin/login">Admin Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
