import React from 'react';
import './Footer.scss'

const Footer = () => {
    return (
        <div id="footer">
            <div className="site-footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <a href="/" className="logo">KhoBau Digital</a>
                        <p data-i18n="footer.tagline">Premium digital subscriptions and services, delivered instantly at the best prices.</p>
                    </div>
                    <div className="footer-links">
                        <h4 data-i18n="footer.services">Services</h4>
                        <ul>
                            <li><a href="#products" data-i18n="footer.allServices">All Services</a></li>
                            <li><a href="#products" data-i18n="footer.streamingServices">Streaming</a></li>
                            <li><a href="#products" data-i18n="footer.creativeTools">Creative Tools</a></li>
                            <li><a href="#products" data-i18n="footer.cloudStorage">Cloud Storage</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4 data-i18n="footer.company">Company</h4>
                        <ul>
                            <li><a href="#" data-i18n="footer.aboutUs">About Us</a></li>
                            <li><a href="#" data-i18n="footer.contact">Contact</a></li>
                            <li><a href="#" data-i18n="footer.terms">Terms of Service</a></li>
                            <li><a href="#" data-i18n="footer.privacy">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div className="footer-links">
                        <h4 data-i18n="footer.support">Support</h4>
                        <ul>
                            <li><a href="#" data-i18n="footer.howItWorks">How It Works</a></li>
                            <li><a href="#" data-i18n="footer.activationHelp">Activation Help</a></li>
                            <li><a href="#" data-i18n="footer.refundPolicy">Refund Policy</a></li>
                            <li><a href="#" data-i18n="footer.faq">FAQ</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <span data-i18n="footer.copyright">&copy; 2026 KhoBau Digital. All rights reserved.</span>
                    <span data-i18n="footer.delivery">Instant digital delivery</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;