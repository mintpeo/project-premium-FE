import React from 'react';
import { Bell, User, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
  };

  return (
    <header className="h-16 bg-base-100 border-b border-base-200 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <button className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors">
          <Bell size={18} className="text-gray-400" />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-base-200 transition-all duration-200 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              {getInitials(user?.fullName)}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium leading-tight max-w-[120px] truncate">
                {user?.fullName || user?.email || 'User'}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">{user?.role || ''}</p>
            </div>
            <ChevronDown size={14} className="text-gray-400" />
          </label>
          <ul tabIndex={0} className="mt-2 z-[1] p-1.5 shadow-lg dropdown-content bg-base-100 rounded-xl w-52 border border-base-200">
            <li><Link to="/profile" className="block px-4 py-2 text-sm hover:bg-base-200 rounded-lg transition-colors">Trang cá nhân</Link></li>
            <li><Link to="/profile" className="block px-4 py-2 text-sm hover:bg-base-200 rounded-lg transition-colors">Cài đặt</Link></li>
            <li className="border-t border-base-200 mt-1 pt-1">
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-error/5 rounded-lg transition-colors w-full">
                <LogOut size={14} />
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
