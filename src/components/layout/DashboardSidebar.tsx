import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, DollarSign, LogOut, FolderTree, UserCheck, Banknote, MessageSquare, MessageCircle, Tags, Key, RotateCcw, Globe, TrendingUp, Wallet } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isAdmin = location.pathname.startsWith('/admin');


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Người dùng', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Sản phẩm', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Đơn hàng', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Danh mục', path: '/admin/categories', icon: <FolderTree size={20} /> },
    { name: 'Người bán', path: '/admin/sellers', icon: <UserCheck size={20} /> },
    { name: 'Duyệt thanh toán', path: '/admin/payments', icon: <Banknote size={20} /> },
    { name: 'Trả hoa hồng', path: '/admin/withdrawals', icon: <Wallet size={20} /> },
    { name: 'Doanh thu', path: '/admin/revenue', icon: <TrendingUp size={20} /> },
    { name: 'Đánh giá', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
    { name: 'Bình luận', path: '/admin/comments', icon: <MessageCircle size={20} /> },
    { name: 'Mã giảm giá', path: '/admin/coupons', icon: <Tags size={20} /> },
    { name: 'Kho key', path: '/admin/keys', icon: <Key size={20} /> },
    { name: 'Hoàn tiền', path: '/admin/refunds', icon: <RotateCcw size={20} /> },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Sản phẩm', path: '/seller/products', icon: <Package size={20} /> },
    { name: 'Mã giảm giá', path: '/seller/coupons', icon: <Tags size={20} /> },
    { name: 'Đánh giá', path: '/seller/reviews', icon: <MessageCircle size={20} /> },
    { name: 'Doanh thu', path: '/seller/revenue', icon: <DollarSign size={20} /> },
    { name: 'Đơn hàng', path: '/seller/orders', icon: <ShoppingCart size={20} /> },
  ];

  const links = isAdmin ? adminLinks : sellerLinks;

  return (
    <aside className="w-64 bg-base-100 h-screen flex flex-col border-r border-base-200 shadow-sm">
      <div className="p-5 border-b border-base-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <h1 className="text-lg font-bold text-base-content">{isAdmin ? 'Admin' : 'Seller'}</h1>
        </div>
        <p className="text-xs text-gray-400 mt-0.5 ml-5">{isAdmin ? 'Quản trị hệ thống' : 'Kênh người bán'}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-base-content/60 hover:text-base-content hover:bg-base-200'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <span className={`relative transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {link.icon}

              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-base-200 space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 w-full group"
        >
          <Globe size={20} className="group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">Về trang chủ</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-error hover:bg-error/5 transition-all duration-200 w-full group"
        >
          <LogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
