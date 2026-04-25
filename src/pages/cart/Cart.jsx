import React from 'react';
import './Cart.scss'

const Cart = () => {
    return (
        <div id="cart">
            <div className="cart-overlay" id="cart-overlay"></div>
            <aside className="cart-sidebar" id="cart-sidebar" aria-label="Shopping cart">
                <div className="cart-header">
                    <h3 data-i18n="cart.title">Your Cart</h3>
                    <button className="cart-close" id="cart-close-btn" aria-label="Close cart">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="cart-items" id="cart-items">
                    <div className="cart-empty">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                             strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                        </svg>
                        <p data-i18n="cart.empty">Your cart is empty</p>
                        <span data-i18n="cart.emptyHint">Add services to get started</span>
                    </div>
                </div>
                <div className="cart-footer">
                    <div className="cart-subtotal">
                        <span data-i18n="cart.subtotal">Subtotal</span>
                        <span id="cart-subtotal-amount">0 items</span>
                    </div>
                    <div className="cart-total">
                        <span className="cart-total-label" data-i18n="cart.total">Total</span>
                        <span className="cart-total-amount" id="cart-total-amount">$0</span>
                    </div>
                    <button className="btn-checkout" id="checkout-btn" disabled data-i18n="cart.placeOrder">Place Order</button>
                </div>
            </aside>
        </div>
    );
};

export default Cart;