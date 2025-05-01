import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/SendQuotation.css";
import Header from "./Header";
import Footer from "./Footer";

const SendQuotation = () => {
    const { state } = useLocation();
    const { quotation } = state || {};

    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    // Extracting product details
    const productIds = quotation ? quotation.map((product) => product.id) : [];
    const productNames = quotation ? quotation.map((product) => product.name) : [];
    const prices = quotation ? quotation.map((product) => product.price) : [];
    const quantities = quotation ? quotation.map((product) => product.quantity) : [];
    const totalPrice = quotation ? quotation.reduce((total, product) => total + product.totalPrice, 0) : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!customerName || !email || !phone) {
            return setStatus("All fields are required!");
        }

        const quotationData = {
            customer_name: customerName,
            email,
            phone,
            product_ids: productIds,
            product_names: productNames,
            prices: prices,
            quantities: quantities,
            total_price: totalPrice,
            message,
        };

        setLoading(true);

        try {
            const response = await axios.post("http://localhost:5000/api/quotations", quotationData);
            setStatus("Quotation sent successfully!");
        } catch (error) {
            setStatus("Error sending quotation. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="send-quotation-container">
            <Header />
            <h2>Send a Quotation</h2>
            <form onSubmit={handleSubmit} className="quotation-form">
                <div className="form-group">
                    <label htmlFor="customerName">Customer Name</label>
                    <input
                        type="text"
                        id="customerName"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Selected Products</label>
                    <table className="quotation-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price (₹)</th>
                                <th>Quantity</th>
                                <th>Total (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productNames.map((name, index) => (
                                <tr key={index}>
                                    <td>{name}</td>
                                    <td>₹{prices[index]}</td>
                                    <td>{quantities[index]}</td>
                                    <td>₹{prices[index] * quantities[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message (Optional)</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send Quotation"}
                </button>
            </form>

            {status && <p className="status-message">{status}</p>}

            <Footer />
        </div>
    );
};

export default SendQuotation;
