import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  const navigate = useNavigate();
  const dataLocalSto = localStorage.getItem('auth_user');
  const user = dataLocalSto ? JSON.parse(dataLocalSto) : null;
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const getYourCart = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/cart/${user.id}`);
        const data = await res.json();
        setCartItems(data);
      } catch(e) {
        console.error("Error: Get Your Cart", e);
      }
    }
    getYourCart();
  }, []);

  const updateQuantity = async (id: number, delta: number) => {
    let newQuantity = 0;
    let found = false;

    cartItems.forEach((item) => {
      if (item.id === id) {
        newQuantity = Math.max(1, item.quantity + delta);
        found = true;
      }
    });

    if (!found) return;
    setCartItems(prev => prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
    ));

    try {
      await fetch(`http://localhost:8080/api/cart/updateQuantity?cartItemId=${id}&quantity=${newQuantity}`, {
        method: "PATCH"
      });
    } catch (e) {
      console.log("Error: Update Quantity", e);
    }
  };

  const removeItem = async (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    try {
      await fetch(`http://localhost:8080/api/cart/delete?cartItemId=${id}`, {
        method: "DELETE"
      });
    } catch (e) {
      console.log("Error: Delete Quantity", e);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng ({cartItems.length})</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <svg className="w-20 h-20 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-lg">Giỏ hàng của bạn đang trống.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                <div className="w-24 h-24 bg-white rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={item.productImg} alt={item.productName} className="w-full h-full object-contain p-2" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold text-gray-800 line-clamp-2 pr-4">{item.productName}</h3>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition shrink-0 bg-white p-1 rounded-md border border-gray-200 shadow-sm hover:border-red-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-0.5">
                      {item.duration && item.duration.length > 0 && (
                        <span className="text-gray-500 text-xs">{item.duration}</span>
                      )}
                      {item.typeUser && item.typeUser.length > 0 && (
                        <span className="text-gray-500 text-xs">{item.typeUser}</span>
                      )}
                      <span className="text-gray-800 font-bold text-lg">{item.productPrice?.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 text-sm font-medium border-x border-gray-300 min-w-[40px] text-center bg-gray-50 text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 font-medium text-lg">Tổng tiền:</span>
            <span className="text-3xl font-bold text-[#ff7f00]">{totalAmount.toLocaleString('vi-VN')}đ</span>
          </div>
          <button
            onClick={() => {
              onClose();
              navigate('/checkout');
            }}
            className="w-full bg-gradient-to-r from-[#ff7f00] to-[#e65c00] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
            disabled={cartItems.length === 0}
          >
            MUA HÀNG
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
