import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Checkout from "./pages/Checkout";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";

// New Pages
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUsers from "./pages/AdminPages/ManageUsers";
import ManageProducts from "./pages/AdminPages/ManageProducts";
import ManageOrders from "./pages/AdminPages/ManageOrders";
import MyProducts from "./pages/SellerPages/MyProducts";
import PersonalRevenue from "./pages/SellerPages/PersonalRevenue";
import ProcessOrders from "./pages/SellerPages/ProcessOrders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Retail Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard Routes with Layout */}
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<ManageUsers />} />
          <Route path="/admin/products" element={<ManageProducts />} />
          <Route path="/admin/orders" element={<ManageOrders />} />

          {/* Seller Routes */}
          <Route path="/seller/dashboard" element={<Dashboard />} />
          <Route path="/seller/products" element={<MyProducts />} />
          <Route path="/seller/revenue" element={<PersonalRevenue />} />
          <Route path="/seller/orders" element={<ProcessOrders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
