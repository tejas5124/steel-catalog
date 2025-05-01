import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Details Section */}
        <div className="footer-contact">
          <div className="contact-item">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <p>438, Rockford House, 2nd Floor</p>
              <p>Above Axis Bank, Patthe Bapurao Marg</p>
              <p><strong>Mumbai - 400004, Maharashtra, India</strong></p>
            </div>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone-alt"></i>
            <p><strong>+91 9021832015</strong></p>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope"></i>
            <a href="mailto:manavsteelco@gmail.com">manavsteelco@gmail.com</a>
          </div>
        </div>

        {/* About Company Section */}
        <div className="footer-about">
          <h4>About Manav Steel & Engineering Co.</h4>
          <p>
            Established in 2003, we are leading manufacturers and suppliers of high-quality stainless steel products, including pipes, tubes, sheets, plates, and fittings. Our commitment to excellence has earned us a reputable position in the industry.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
