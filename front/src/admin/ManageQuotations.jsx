import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/ManageQuotations.css";
import AdminSidebar from "./AdminSidebar";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";

const ManageQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleModify = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedQuotation(null);
  };

  const handleUpdateQuotation = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quotations/${selectedQuotation.id}`, selectedQuotation);
      setQuotations((prev) =>
        prev.map((q) =>
          q.id === selectedQuotation.id ? selectedQuotation : q
        )
      );
      handleModalClose();
    } catch (error) {
      console.error("Error updating quotation:", error);
    }
  };

  const handleRemoveQuotation = async (quotationId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/quotations/${quotationId}`);
      if (response.status === 200) {
        setQuotations((prev) => prev.filter((q) => q.id !== quotationId));
      } else {
        console.error("Failed to remove quotation:", response.data);
      }
    } catch (error) {
      console.error("Error removing quotation:", error);
    }
  };

  const handleStatusUpdate = async (quotationId, status) => {
    try {
      const newStatus = status === "pending" ? "completed" : "pending";
      const response = await axios.put(`http://localhost:5000/api/quotations/${quotationId}/status`, { status: newStatus });
      if (response.status === 200) {
        setQuotations((prev) =>
          prev.map((q) =>
            q.id === quotationId ? { ...q, status: newStatus } : q
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleConfirmToggle = async (quotationId, isConfirmed) => {
    try {
      const newConfirmationStatus = isConfirmed === "Yes" ? "No" : "Yes";
      const response = await axios.put(`http://localhost:5000/api/quotations/${quotationId}/confirm`, { is_confirmed: newConfirmationStatus });
      if (response.status === 200) {
        setQuotations((prev) =>
          prev.map((q) =>
            q.id === quotationId ? { ...q, is_confirmed: newConfirmationStatus } : q
          )
        );
      }
    } catch (error) {
      console.error("Error toggling confirmation status:", error);
    }
  };

  return (
    <div className="manage-quotations-container">
      <AdminSidebar />

      <div className="content">
        <h2>Manage Quotations</h2>

        <table className="quotations-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Confirmed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotations.length > 0 ? (
              quotations.map((quotation) => (
                <tr key={quotation.id}>
                  <td>{quotation.id}</td>
                  <td>{quotation.customer_name}</td>
                  <td>{quotation.product_names.join(", ")}</td>
                  <td>₹{quotation.total_price}</td>
                  <td>{quotation.status}</td>
                  <td>{quotation.is_confirmed}</td>
                  <td>
                    {/* Approve button will toggle between 'pending' and 'completed' */}
                    <button
                      className="approve-btn"
                      onClick={() => handleStatusUpdate(quotation.id, quotation.status)}
                    >
                      <FaCheck /> {quotation.status === "pending" ? "Complete" : "Pending"}
                    </button>

                    {/* Confirm button will toggle between 'Yes' and 'No' */}
                    <button
                      className="confirm-btn"
                      onClick={() => handleConfirmToggle(quotation.id, quotation.is_confirmed)}
                    >
                      {quotation.is_confirmed === "Yes" ? "Unconfirm" : "Confirm"}
                    </button>

                    {/* Remove button */}
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveQuotation(quotation.id)}
                    >
                      <FaTrash /> Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modal for Modifying Quotation */}
        {isModalOpen && selectedQuotation && (
          <div className="quotation-details-overlay">
            <div className="quotation-details">
              <h3>Modify Quotation</h3>
              <label>Product Names</label>
              <input
                type="text"
                value={selectedQuotation.product_names.join(", ")}
                onChange={(e) =>
                  setSelectedQuotation({
                    ...selectedQuotation,
                    product_names: e.target.value.split(", "),
                  })
                }
              />
              <label>Total Price</label>
              <input
                type="number"
                value={selectedQuotation.total_price}
                onChange={(e) =>
                  setSelectedQuotation({ ...selectedQuotation, total_price: e.target.value })
                }
              />
              <div className="modal-actions">
                <button className="update-btn" onClick={handleUpdateQuotation}>
                  Update
                </button>
                <button className="cancel-btn" onClick={handleModalClose}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuotations;
