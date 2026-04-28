import React from 'react';
import { Bell, User } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header className="h-16 bg-base-100 border-b border-base-300 flex items-center justify-between px-6 shrink-0">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <button className="btn btn-ghost btn-circle">
          <Bell size={20} />
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <User size={20} />
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
