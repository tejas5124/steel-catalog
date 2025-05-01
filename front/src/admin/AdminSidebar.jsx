import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FaBox, FaPlus, FaTools, FaEye, 
  FaFileInvoice, FaClipboardList, FaEnvelope, 
  FaSignOutAlt, FaChevronLeft, FaChevronRight 
} from "react-icons/fa";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin"));
    const token = localStorage.getItem("token");

    if (!storedAdmin || !token) {
      navigate("/admin/login"); // Redirect if not authenticated
      return;
    }

    setAdmin(storedAdmin);
  }, [navigate]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  if (!admin) return null; // Prevent rendering if admin is not loaded

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>{!isCollapsed && "Admin Panel"}</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Sidebar Menu */}
      <ul className="sidebar-menu">
        <li>
          <NavLink to={`/admin/${admin.id}/dashboard`} className="menu-item">
            <FaBox /> {!isCollapsed && "Dashboard"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/add-product`} className="menu-item">
            <FaPlus /> {!isCollapsed && "Add Product"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/manage-product`} className="menu-item">
            <FaTools /> {!isCollapsed && "Manage Product"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/view-products`} className="menu-item">
            <FaEye /> {!isCollapsed && "View Products"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/view-quotations`} className="menu-item">
            <FaFileInvoice /> {!isCollapsed && "View Quotations"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/manage-quotations`} className="menu-item">
            <FaClipboardList /> {!isCollapsed && "Manage Quotations"}
          </NavLink>
        </li>
        <li>
          <NavLink to={`/admin/${admin.id}/send-email`} className="menu-item">
            <FaEnvelope /> {!isCollapsed && "Send Email"}
          </NavLink>
        </li>
      </ul>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        {!isCollapsed && admin && (
          <>
            <p>Welcome, {admin.name}!</p>
            <p>Email: {admin.email}</p>
            <p>ID: {admin.id}</p>
          </>
        )}
        <button onClick={handleLogout} className="logout">
          <FaSignOutAlt /> {!isCollapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
