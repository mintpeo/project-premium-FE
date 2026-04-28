import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// MOCK DATA for presentation
const mockCartItems = [
  {
    id: 1,
    name: "Tài khoản Netflix Premium (1 Tháng)",
    price: 89000,
    quantity: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    id: 2,
    name: "Youtube Premium (Nâng cấp tài khoản chính chủ 6 tháng)",
    price: 180000,
    quantity: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
  }
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const totalAmount = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4FF] font-sans">
      <Header />
      
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Thanh toán</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Form & Payment */}
          <div className="flex-1 space-y-8">
            {/* Billing Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
                Thông tin thanh toán
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Họ và tên *</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập họ tên" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập số điện thoại" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập địa chỉ email" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                  <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Ghi chú thêm về đơn hàng..."></textarea>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'bank' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank" 
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Chuyển khoản ngân hàng / VNPay</h3>
                      <p className="text-sm text-gray-500">Quét mã QR tiện lợi, tự động xác nhận đơn.</p>
                    </div>
                  </div>
                </label>

                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="momo" 
                    checked={paymentMethod === 'momo'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" 
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Ví Momo</h3>
                      <p className="text-sm text-gray-500">Thanh toán qua ví điện tử Momo.</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {mockCartItems.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.name}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">SL: {item.quantity}</span>
                        <span className="text-sm font-bold text-gray-800">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-800">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Giảm giá</span>
                  <span className="font-medium text-green-600">0đ</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Tổng cộng</span>
                  <span className="text-[#ff7f00]">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-[#ff7f00] to-[#e65c00] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-700 transition duration-300 transform hover:-translate-y-1">
                ĐẶT HÀNG NGAY
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4">
                Bằng việc đặt hàng, bạn đồng ý với <a href="#" className="flex-1 text-blue-500 hover:underline">Điều khoản dịch vụ</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
