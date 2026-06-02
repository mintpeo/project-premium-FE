import React, {useEffect, useState} from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import {useNavigate, useLocation} from "react-router-dom";
import './Checkout.css';

// MOCK DATA for presentation
// const mockCartItems = [
//   {
//     id: 1,
//     name: "Tài khoản Netflix Premium (1 Tháng)",
//     price: 89000,
//     quantity: 1,
//     image: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
//   },
//   {
//     id: 2,
//     name: "Youtube Premium (Nâng cấp tài khoản chính chủ 6 tháng)",
//     price: 180000,
//     quantity: 2,
//     image: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
//   }
// ];

interface CartItem {
  productId: number;
  quantity: number;
  typeUser?: string;
  duration?: string;
  productPrice: number;
  productImg: string;
  productName: string;
}

const Checkout = () => {
  const dataLocalSto = localStorage.getItem('auth_user');
  const user = dataLocalSto ? JSON.parse(dataLocalSto) : null;
  const navigate = useNavigate();
  const location = useLocation();

  const [mockCartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [note, setNote] = useState("");

  // check out
  const checkOut = async () => {
    const items = mockCartItems.map(item => ({
      "productId": item.productId,
      "quantity": item.quantity,
      "typeUser": item.typeUser || "",
      "duration": item.duration || ""
    }));

    const body = {
      "orderInfo": {
        "userId": user.id,
        "fullName": fullName,
        "phoneNumber": phoneNumber,
        "paymentMethod": paymentMethod,
        "paymentStatus": "PENDING",
        "orderStatus": "PROCESSING",
        "note": note,
        "totalPrice": totalAmount
      },
      "items": items
    }

    try {
      const res = await fetch(`http://localhost:8080/api/order/add`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          navigate("/");
        }
      } else {
        const errorData = await res.json();
        alert("Lỗi tạo đơn hàng: " + (errorData.error || "Không rõ nguyên nhân"));
      }
    } catch(e) {
      console.error("Error: Add Order", e);
      alert("Đã có lỗi xảy ra khi kết nối với máy chủ.");
    }
  }

  useEffect(() => {
    const buyNowProduct = location.state?.product;
    if (buyNowProduct) {
      setCartItems([{
        productId: buyNowProduct.id,
        quantity: 1,
        typeUser: buyNowProduct.typesUser?.[0] || "",
        duration: buyNowProduct.duration?.[0] || "",
        productPrice: buyNowProduct.price,
        productImg: buyNowProduct.img,
        productName: buyNowProduct.name,
      }]);
      setIsLoading(false);
      return;
    }

    const getYourCart = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/cart/${user.id}`);
        const data = await res.json();
        setCartItems(data);
        setIsLoading(false);
      } catch(e) {
        console.error("Error: Get Mock Cart Item", e);
        setIsLoading(false);
      }
    }

    getYourCart();
  }, []);

  const totalAmount = mockCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);

  if (isLoading) return (<div>Loading Mock Cart Item...</div>)

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4FF] font-sans">
      <Header />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 py-8">
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
                  <input onChange={(e) => setFullName(e.target.value)} type="text" className="w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập họ tên" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Số điện thoại *</label>
                  <input onChange={(e) => setPhoneNumber(e.target.value)} type="tel" className="w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập số điện thoại" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Nhập địa chỉ email" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-700">Ghi chú (Tùy chọn)</label>
                  <textarea onChange={(e) => setNote(e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl text-gray-900 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition" placeholder="Ghi chú thêm về đơn hàng..."></textarea>
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
                      <h3 className="font-semibold text-gray-800">Chuyển khoản ngân hàng</h3>
                      <p className="text-sm text-gray-500">Quét mã QR tiện lợi, tự động xác nhận đơn.</p>
                    </div>
                  </div>
                </label>

                {/*<label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'momo' ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-blue-300'}`}>*/}
                {/*  <input */}
                {/*    type="radio" */}
                {/*    name="payment" */}
                {/*    value="momo" */}
                {/*    checked={paymentMethod === 'momo'}*/}
                {/*    onChange={(e) => setPaymentMethod(e.target.value)}*/}
                {/*    className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500" */}
                {/*  />*/}
                {/*  <div className="ml-4 flex items-center gap-3">*/}
                {/*    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">*/}
                {/*       <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/></svg>*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*      <h3 className="font-semibold text-gray-800">Ví Momo</h3>*/}
                {/*      <p className="text-sm text-gray-500">Thanh toán qua ví điện tử Momo.</p>*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</label>*/}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[500px]">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Đơn hàng của bạn</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {mockCartItems.map(item => (
                  <div key={item.productId} className="item-detail flex gap-4" onClick={() => navigate(`/product/${item.productId}`)}>
                    <div className="w-16 h-16 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      <img src={item.productImg} alt={item.productName} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{item.productName}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">SL: <b>{item.quantity}</b></span>
                        {item.duration && item.duration.length > 0 ? (
                            <span className="text-xs text-gray-500">Thời hạn: <b>{item.duration}</b></span>
                        ) : (<></>)}

                        {item.typeUser && item.typeUser.length > 0 ? (
                            <span className="text-xs text-gray-500">Loại: <b>{item.typeUser}</b></span>
                        ) : (<></>)}

                        <span className="text-sm font-bold text-gray-800">{(item.productPrice * item.quantity).toLocaleString('vi-VN')}đ</span>
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

              <button
                  onClick={() => checkOut()}
                  className="w-full bg-gradient-to-r from-[#ff7f00] to-[#e65c00] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:from-orange-500 hover:to-orange-700 transition duration-300 transform hover:-translate-y-1">
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
