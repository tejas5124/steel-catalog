import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ViewQuotations.css";
import AdminSidebar from "./AdminSidebar";

const ViewQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quotations");
      setQuotations(response.data);
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  return (
    <div className="view-quotations-container">
      <AdminSidebar />

      <div className="content">
        <h2>Quotations List</h2>

        <table className="quotations-table">
        <thead>
  <tr>
    <th>ID</th>
    <th>Customer Name</th>
    <th>Email</th>
    <th>Phone</th>
    <th>Products</th>
    <th>Quantities</th>
    <th>Prices</th>
    <th>Status</th>
    <th>Confirmed</th>
    <th>Email Sent</th>
    <th>Created At</th>
    <th>Actions</th>
  </tr>
</thead>

          <tbody>
            {quotations.length > 0 ? (
              quotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td>{quotation.id}</td>
                  <td>{quotation.customer_name}</td>
                  <td>{quotation.email}</td>
                  <td>{quotation.phone}</td>
                  <td>
                    {Array.isArray(quotation.products) && quotation.products.length > 0
                      ? quotation.products.map((product) => product.name).join(", ")
                      : "No products"}
                  </td>
                  <td>
                    {Array.isArray(quotation.quantities) && quotation.quantities.length > 0
                      ? quotation.quantities.join(", ")
                      : "No quantities"}
                  </td>
                  <td>
                    {Array.isArray(quotation.prices) && quotation.prices.length > 0
                      ? quotation.prices.map((price) => `₹${price}`).join(", ")
                      : "No prices"}
                  </td>
                  <td>{quotation.status}</td>
                  <td>{quotation.is_confirmed ? "Yes" : "No"}</td>
                  <td>{quotation.email_sent ? "Yes" : "No"}</td> {/* ✅ Email Sent Column */}
                  <td>{new Date(quotation.created_at).toLocaleString()}</td>
                  <td>
                    <button onClick={() => setSelectedQuotation(quotation)} className="view-btn">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>No quotations found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Quotation Details Modal */}
        {selectedQuotation && (
          <div className="quotation-details-overlay">
            <div className="quotation-details">
              <div className="details-text">
                <h3>Quotation Details</h3>
                <p><strong>ID:</strong> {selectedQuotation.id}</p>
                <p><strong>Customer Name:</strong> {selectedQuotation.customer_name}</p>
                <p><strong>Email:</strong> {selectedQuotation.email}</p>
                <p><strong>Phone:</strong> {selectedQuotation.phone}</p>
                <p><strong>Products:</strong> {Array.isArray(selectedQuotation.products) && selectedQuotation.products.length > 0
                  ? selectedQuotation.products.map((product) => product.name).join(", ")
                  : "No products"}
                </p>
                <p><strong>Quantities:</strong> {Array.isArray(selectedQuotation.quantities) && selectedQuotation.quantities.length > 0
                  ? selectedQuotation.quantities.join(", ")
                  : "No quantities"}
                </p>
                <p><strong>Prices:</strong> {Array.isArray(selectedQuotation.prices) && selectedQuotation.prices.length > 0
                  ? selectedQuotation.prices.map((price) => `₹${price}`).join(", ")
                  : "No prices"}
                </p>
                <p><strong>Status:</strong> {selectedQuotation.status}</p>
                <p><strong>Confirmed:</strong> {selectedQuotation.is_confirmed ? "Yes" : "No"}</p>
                <p><strong>Email Sent:</strong> {selectedQuotation.email_sent ? "Yes" : "No"}</p> {/* ✅ Show in Details */}
                <p><strong>Created At:</strong> {new Date(selectedQuotation.created_at).toLocaleString()}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedQuotation(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuotations;
