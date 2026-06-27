import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth";
import OAuthSuccess from "./pages/OAuthSuccess";
import FacebookCallback from "./pages/FacebookCallback";
import ResetPassword from "./pages/Profile/ResetPassword";
import Profile from "./pages/Profile/Profile";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Checkout from "./pages/Checkout";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import CategoryProductDetail from "./pages/CategoryPage/CategoryProductDetail";
import SearchPage from "./pages/Search/SearchPage";
import ScrollToTop from "./components/ScrollToTop";

// Layout
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// New Pages
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import ManageUsers from "./pages/AdminPages/ManageUsers";
import ManageProducts from "./pages/AdminPages/ManageProducts";
import ManageOrders from "./pages/AdminPages/ManageOrders";
import ManageCategories from "./pages/AdminPages/ManageCategories";
import ManageSellers from "./pages/AdminPages/ManageSellers";
import ApprovePayments from "./pages/AdminPages/ApprovePayments";
import ApproveWithdrawals from "./pages/AdminPages/ApproveWithdrawals";
import ManageRevenue from "./pages/AdminPages/ManageRevenue";
import ManageReviews from "./pages/AdminPages/ManageReviews";
import ManageComments from "./pages/AdminPages/ManageComments";
import ManageCoupons from "./pages/AdminPages/ManageCoupons";
import ManageProductKeys from "./pages/AdminPages/ManageProductKeys";
import ManageRefunds from "./pages/AdminPages/ManageRefunds";
import AdminSettings from "./pages/AdminPages/AdminSettings";
import MyProducts from "./pages/SellerPages/MyProducts";
import PersonalRevenue from "./pages/SellerPages/PersonalRevenue";
import ProcessOrders from "./pages/SellerPages/ProcessOrders";
import SellerCoupons from "./pages/SellerPages/SellerCoupons";
import SellerComments from "./pages/SellerPages/SellerComments";
import PaymentSuccess from "./pages/Profile/PaymentSuccess";
import PaymentCancel from "./pages/Profile/PaymentCancel";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Retail Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/oauth-callback" element={<OAuthSuccess />} />
        <Route path="/facebook-callback" element={<FacebookCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/category/:category" element={<CategoryPage />} />
        <Route path="/product/:category/:productId" element={<CategoryProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        
        <Route path="/login" element={<Login />} />
        
        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        
        {/* Protected Profile Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/products" element={<ManageProducts />} />
              <Route path="/admin/orders" element={<ManageOrders />} />
              <Route path="/admin/categories" element={<ManageCategories />} />
              <Route path="/admin/sellers" element={<ManageSellers />} />
              <Route path="/admin/payments" element={<ApprovePayments />} />
              <Route path="/admin/reviews" element={<ManageReviews />} />
              <Route path="/admin/comments" element={<ManageComments />} />
              <Route path="/admin/coupons" element={<ManageCoupons />} />
              <Route path="/admin/keys" element={<ManageProductKeys />} />
              <Route path="/admin/refunds" element={<ManageRefunds />} />
              <Route path="/admin/revenue" element={<ManageRevenue />} />
              <Route path="/admin/withdrawals" element={<ApproveWithdrawals />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>

            {/* Seller Routes */}
            <Route element={<ProtectedRoute allowedRoles={['SELLER']} />}>
              <Route path="/seller/dashboard" element={<Dashboard />} />
              <Route path="/seller/products" element={<MyProducts />} />
              <Route path="/seller/revenue" element={<PersonalRevenue />} />
              <Route path="/seller/orders" element={<ProcessOrders />} />
              <Route path="/seller/coupons" element={<SellerCoupons />} />
              <Route path="/seller/reviews" element={<SellerComments />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
