import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CartSidebar from './CartSidebar';
import { SiNetflix, SiCanva } from 'react-icons/si';
import { BiLogoAdobe } from 'react-icons/bi';
import { FcGoogle } from 'react-icons/fc';
import { FaBrain, FaShieldAlt, FaGamepad, FaSpotify } from 'react-icons/fa';
import { BsMicrosoft } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';


const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    if (user.role === 'SELLER') return '/seller/dashboard';
    return '/profile';
  };
  return (
    <header className="bg-[#1e2a4a] border-b border-blue-900/30 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="max-w-[1600px] mx-[10%] py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mb-2 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="text-[2.5rem] font-black tracking-tighter leading-none italic">
            <span className="text-[#ff7f00]">PREMIUM</span>
            <span className="text-[#e65c00]">KEY</span>
            <span className="text-[#e65c00] text-sm ml-1">.COM</span>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập nội dung cần tìm..."
              className="w-full px-6 py-3 rounded-full bg-[#2a3859] border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Login & Cart */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to={getDashboardLink()}
                className="px-4 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span className="max-w-[120px] truncate text-sm">{user?.fullName || user?.email}</span>
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="px-6 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Đăng nhập</span>
            </Link>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-6 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
          >
            <span>Giỏ hàng</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="border-t mx-[10%] border-blue-900/30">
        <div className="max-w-[1600px] mx-auto  py-3 flex items-center gap-8">
          {/* Categories Dropdown */}
          <button className="px-5 py-2.5 rounded-full bg-orange-500 border-2 border-orange-300 text-white flex items-center gap-2 hover:bg-orange-600 transition-all duration-300 shadow-[0_0_15px_rgba(249,115,22,0.6)] hover:shadow-[0_0_25px_rgba(249,115,22,0.9)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-medium">Danh mục</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Brand Icons */}
          <div className="flex items-center justify-between flex-1">
            <button className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <SiNetflix className="h-6 w-auto text-[#E50914]" />
              <span className="text-sm font-medium text-white">Netflix</span>
            </button>

            <button className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <BiLogoAdobe className="h-6 w-auto text-[#FF0000]" />
              <span className="text-sm font-medium text-white">Adobe</span>
            </button>

            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <FcGoogle className="h-6 w-auto" />
              <span className="text-sm font-medium text-white">Google</span>
            </button>

            <button className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <BsMicrosoft className="h-6 w-auto text-[#00A4EF]" />
              <span className="text-sm font-medium text-white">Microsoft</span>
            </button>

            <button className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <FaSpotify className="h-6 w-auto text-[#1DB954]" />
              <span className="text-sm font-medium text-white">Spotify</span>
            </button>

            <button className="flex items-center gap-2 cursor-pointer hover:opacity-80">
              <SiCanva className="h-6 w-auto text-[#00C4CC]" />
              <span className="text-sm font-medium text-white">Canva</span>
            </button>

            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <FaBrain className="h-6 w-auto text-blue-500" />
              <span className="text-sm font-medium text-white">AI</span>
            </button>

            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <FaShieldAlt className="h-6 w-auto text-green-500" />
              <span className="text-sm font-medium text-white">Bảo mật</span>
            </button>

            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition">
              <FaGamepad className="h-6 w-auto text-green-500" />
              <span className="text-sm font-medium text-white">Games</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Sidebar Component */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;