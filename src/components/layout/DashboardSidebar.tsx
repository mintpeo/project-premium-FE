import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, DollarSign, LogOut } from 'lucide-react';
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
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
  ];

  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Products', path: '/seller/products', icon: <Package size={20} /> },
    { name: 'Revenue', path: '/seller/revenue', icon: <DollarSign size={20} /> },
    { name: 'Orders', path: '/seller/orders', icon: <ShoppingCart size={20} /> },
  ];

  const links = isAdmin ? adminLinks : sellerLinks;

  return (
    <aside className="w-64 bg-base-200 h-screen flex flex-col border-r border-base-300">
      <div className="p-4 border-b border-base-300">
        <h1 className="text-xl font-bold text-primary">{isAdmin ? 'Admin Portal' : 'Seller Portal'}</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary text-primary-content font-medium' : 'hover:bg-base-300 text-base-content'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 transition-colors w-full"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
