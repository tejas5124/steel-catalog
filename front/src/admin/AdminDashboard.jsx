import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { adminId } = useParams(); // Get adminId from URL params
  const [admin, setAdmin] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("❌ No token found. Redirecting to login...");
      navigate("/admin/login");
      return;
    }

    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/admin/${adminId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Admin data: ", data);
        setAdmin(data); // ✅ set state here
      } catch (error) {
        if (error.response) {
          console.error("❌ API Error:", error.response.data);
          setError(error.response.data.message || "Failed to fetch admin data");
        } else {
          console.error("❌ Network or other error:", error.message);
          setError("Network error");
        }
      }
    };

    fetchAdminData();
  }, [adminId, navigate]);

  if (!admin && !error) return <p>Loading...</p>;

  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="admin-dashboard">
      <AdminSidebar admin={admin} />

      <div className="dashboard-content">
        <h2>Admin Dashboard</h2>

        <div className="admin-info">
          <p><strong>Username:</strong> {admin.username}</p>
          <p><strong>Email:</strong> {admin.email}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
