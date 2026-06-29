import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import CartSidebar from './CartSidebar';
import {useAuth} from '../../context/AuthContext';
import {useCart} from '../../context/CartContext';

interface Category {
    id: number;
    name: string;
    icon: string;
    active: boolean;
}

const Header = () => {
    const {isCartOpen, openCart, closeCart} = useCart();
    const {user, logout, isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState<Category[]>([]);
    const tailwindSafelist = "text-[#FF0000] text-[#00A4EF] text-[#1DB954] text-[#00C4CC] text-red-500 text-blue-500 text-green-500";

    const [searchText, setSearchText] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const q = searchText.trim();
        if (q) {
            navigate(`/search?keyword=${encodeURIComponent(q)}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
                setShowUserMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchCategoriesAPI = useCallback(() => {
        fetch('http://localhost:8080/api/categories')
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.error("Lỗi lấy categories:", err));
    }, []);

    useEffect(() => {
        fetchCategoriesAPI();
        const onCategoryUpdate = () => fetchCategoriesAPI();
        window.addEventListener('category-update', onCategoryUpdate);
        window.addEventListener('storage', (e) => { if (e.key === 'category_update') fetchCategoriesAPI(); });
        return () => window.removeEventListener('category-update', onCategoryUpdate);
    }, [fetchCategoriesAPI]);

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
                <form onSubmit={handleSearch} className="flex-1 max-w-lg">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            placeholder="Nhập nội dung cần tìm..."
                            className="w-full px-6 py-3 rounded-full bg-[#2a3859] border-2 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-all duration-300"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </div>
                </form>

                {/* Login & Cart */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="px-4 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                          clipRule="evenodd"/>
                                </svg>
                                <span className="max-w-[120px] truncate text-sm">{user?.fullName || user?.email}</span>
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                                    <Link to="/profile" onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Xem thông tin
                                    </Link>
                                    <hr className="my-1 border-gray-100" />
                                    <button onClick={() => { handleLogout(); setShowUserMenu(false); }}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/auth"
                              className="px-6 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"/>
                            </svg>
                            <span>Đăng nhập</span>
                        </Link>
                    )}
                    <button
                        onClick={openCart}
                        className="px-6 py-2.5 rounded-full border-2 border-blue-400 text-white flex items-center gap-2 bg-[#1e2a4a] hover:bg-[#2a3859] transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
                    >
                        <span>Giỏ hàng</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="border-t mx-[10%] border-blue-900/30">
                <div className="max-w-[1600px] mx-auto py-3 flex items-center gap-8">

                    {/* Render danh sách Icon tự động từ Database */}
                    <div className="flex items-center justify-between flex-1">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => navigate(`/category/${category.id}`)}
                                className="flex items-center gap-2 cursor-pointer text-gray-300 hover:text-white hover:opacity-80 transition"
                            >
                                <i className={`${category.icon} text-2xl`}></i>

                                <span className="text-sm font-medium">
                {category.name}
              </span>
                            </button>
                        ))}
                    </div>

                </div>
            </div>

            {/* Cart Sidebar Component */}
            <CartSidebar isOpen={isCartOpen} onClose={closeCart}/>
        </header>
    );
};

export default Header;