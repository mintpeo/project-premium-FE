import React from 'react';
import './Header.scss'
import {useNavigate} from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div id="header">
            <div className="site-header" id="site-header">
                <div className="header-inner">

                    <a href="/" className="logo" aria-label="KhoBau Digital Home">KhoBau Digital</a>

                    <nav className="nav-links" id="nav-links" aria-label="Service categories">
                        <a href="#products" data-category="all" className="active" data-i18n="nav.all">All</a>
                        <a href="#products" data-category="streaming" data-i18n="nav.streaming">Streaming</a>
                        <a href="#products" data-category="creative" data-i18n="nav.creative">Creative</a>
                        <a href="#products" data-category="learning" data-i18n="nav.learning">Learning</a>
                        <a href="#products" data-category="cloud" data-i18n="nav.cloud">Cloud</a>
                    </nav>

                    <div className="header-actions">
                        <button className="header-btn lang-btn" id="lang-toggle" aria-label="Switch language">EN</button>

                        <button className="header-btn" id="search-toggle" aria-label="Toggle search">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>
                        <button onClick={() => navigate("/cart")} className="header-btn" id="cart-toggle" aria-label="Open cart">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                            </svg>
                            <span className="cart-badge" id="cart-badge">0</span>
                        </button>

                        <div className="auth-area" id="auth-area">
                            <button className="header-btn auth-btn" onClick={() => navigate("/login")} id="auth-toggle" aria-label="Login or Register">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                     strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </button>
                            <div className="user-menu" id="user-menu" style={{display: "none"}}>
                                <button className="user-avatar-btn" id="user-avatar-btn" aria-label="User menu">
                                    <div className="user-avatar" id="user-avatar">U</div>
                                </button>
                                <div className="user-dropdown" id="user-dropdown">
                                    <span className="user-email" id="user-email">user@email.com</span>
                                    <button className="dropdown-item" id="logout-btn" data-i18n="auth.signOut">Sign Out</button>
                                </div>
                            </div>
                        </div>
                        <button className="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="search-bar" id="search-bar">
                    <div className="search-bar-inner">
                        <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" id="search-input" data-i18n-placeholder="search.placeholder" placeholder="Search our collection..." autoComplete={"off"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;