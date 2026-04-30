import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-circle">
          <Bell size={20} />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost flex items-center gap-2 px-3">
            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8 flex items-center justify-center">
              <User size={16} />
            </div>
            <span className="text-sm font-medium max-w-[120px] truncate">
              {user?.fullName || user?.email || 'User'}
            </span>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
            <li className="menu-title px-4 py-1">
              <span className="text-xs text-base-content/50">{user?.role}</span>
            </li>
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
            <li>
              <button onClick={handleLogout} className="text-error flex items-center gap-2">
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
