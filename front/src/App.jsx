import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ProductList from "./components/ProductList";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ViewProducts from "./admin/ViewProducts";
import ManageProduct from "./admin/ManageProduct";
import ViewQuotations from "./admin/ViewQuotations";
import SendQuotation from "./components/SendQuotation";
import ManageQuotations from "./admin/ManageQuotations";
import SendMail from "./admin/SendMail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/send-quotation" element={<SendQuotation />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/:adminId/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/:adminId/add-product" element={<AddProduct />} />
        <Route path="/admin/:adminId/manage-product" element={<ManageProduct />} />
        <Route path="/admin/:adminId/view-products" element={<ViewProducts />} />
        <Route path="/admin/:adminId/view-quotations" element={<ViewQuotations />} />
        <Route path="/admin/:adminId/manage-quotations" element={<ManageQuotations />} />
        <Route path="/admin/:adminId/send-email" element={<SendMail />} />
      </Routes>
    </Router>
  );
}

export default App;
