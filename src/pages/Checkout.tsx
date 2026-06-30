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

  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState<any[]>([]);

  const totalAmount = mockCartItems.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  const POINT_RATE = 100; // 1 point = 100 VND (10 points = 1000 VND)
  const currentPoints = userPoints ?? 0;
  const maxPoints = Math.min(currentPoints, Math.floor(totalAmount / POINT_RATE));
  const discount = usePoints ? pointsToUse * POINT_RATE : 0;
  const finalAmount = totalAmount - discount - couponDiscount;

  const handleSelectCoupon = async (code: string) => {
    if (appliedCoupon === code) {
      setAppliedCoupon('');
      setCouponDiscount(0);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/coupons/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, totalPrice: totalAmount - discount, userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        setCouponDiscount(data.discount);
        setAppliedCoupon(code);
      }
    } catch {}
  };

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
        "totalPrice": finalAmount,
        "pointsUsed": usePoints ? pointsToUse : 0,
        "couponCode": appliedCoupon || '',
        "couponDiscount": couponDiscount
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
    } else {
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
    }

    fetch(`http://localhost:8080/api/user/points/${user.id}`)
      .then(r => r.ok && r.json())
      .then(d => d && setUserPoints(d.points))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (mockCartItems.length > 0) {
      const t = mockCartItems.reduce((s, i) => s + i.productPrice * i.quantity, 0);
      fetch(`http://localhost:8080/api/coupons/available?totalPrice=${t}`)
        .then(r => r.ok && r.json())
        .then(d => d && setAvailableCoupons(d))
        .catch(() => {});
    }
  }, [mockCartItems]);

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

                <div className="border-t border-gray-50 pt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">%</span>
                    <span className="text-sm font-medium text-gray-700">Mã giảm giá</span>
                  </div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <span className="text-sm font-medium text-green-700">{appliedCoupon}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-600">-{couponDiscount.toLocaleString('vi-VN')}đ</span>
                        <button onClick={() => { setAppliedCoupon(''); setCouponDiscount(0); }}
                          className="text-xs text-gray-400 hover:text-red-500 font-medium">Xoá</button>
                      </div>
                    </div>
                  ) : availableCoupons.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableCoupons.map(c => (
                        <div key={c.code} onClick={() => handleSelectCoupon(c.code)}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200 ${c.canUse ? 'bg-white border-gray-200 hover:border-red-300 hover:shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                              {(c.discountType === 'PERCENT' || c.discountType === 'PERCENTAGE') ? `${c.discountValue}%` : `${(c.discountValue/1000).toFixed(0)}K`}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-800">{c.code}</p>
                              <p className="text-xs text-gray-500">
                                {(c.discountType === 'PERCENT' || c.discountType === 'PERCENTAGE') ? `Giảm ${c.discountValue}%` : `Giảm ${c.discountValue.toLocaleString('vi-VN')}đ`}
                                {c.minOrderValue > 0 ? ` - Đơn từ ${c.minOrderValue.toLocaleString('vi-VN')}đ` : ''}
                              </p>
                            </div>
                          </div>
                          {c.canUse ? (
                            <span className="text-xs font-medium text-red-500 shrink-0">Chọn</span>
                          ) : (
                            <span className="text-xs text-gray-400 shrink-0">Chưa đủ</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Không có mã giảm giá nào</p>
                  )}
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Giảm điểm</span>
                  <span className="font-medium text-green-600">{discount > 0 ? `-${discount.toLocaleString('vi-VN')}đ` : '0đ'}</span>
                </div>
                {usePoints && pointsToUse > 0 && (
                  <div className="flex justify-between text-xs text-gray-400">
                    <span></span>
                    <span>({pointsToUse.toLocaleString('vi-VN')} điểm × {POINT_RATE}đ)</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Giảm mã</span>
                    <span className="font-medium text-green-600">-{couponDiscount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                {userPoints !== null && (
                  <div className="border-t border-gray-50 pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">P</span>
                        <span className="text-sm font-medium text-gray-700">Điểm thưởng</span>
                      </div>
                      <span className="text-sm font-semibold text-amber-600">{currentPoints.toLocaleString('vi-VN')} điểm</span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Tỉ lệ quy đổi: <strong>10 điểm = 1.000đ</strong></p>
                    {currentPoints > 0 && (
                      <>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={usePoints} onChange={e => { setUsePoints(e.target.checked); if (!e.target.checked) setPointsToUse(0); else setPointsToUse(maxPoints); }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                          <span className="text-xs text-gray-500">Dùng điểm để giảm tiền</span>
                        </label>
                        {usePoints && (
                          <div className="mt-2 flex items-center gap-2">
                            <input type="number" value={pointsToUse} onChange={e => { const v = Math.min(Math.max(0, parseInt(e.target.value) || 0), maxPoints); setPointsToUse(v); }}
                              className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" min={0} max={maxPoints} />
                            <span className="text-xs text-gray-400 shrink-0">điểm = {(pointsToUse * POINT_RATE).toLocaleString('vi-VN')}đ (tối đa {maxPoints.toLocaleString('vi-VN')} điểm)</span>
                          </div>
                        )}
                      </>
                    )}
                    {currentPoints === 0 && (
                      <p className="text-xs text-gray-400 italic">Bạn chưa có điểm thưởng nào</p>
                    )}
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Tổng cộng</span>
                  <span className="text-[#ff7f00]">{finalAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <p className="text-xs text-gray-400">Bạn được <strong>{(finalAmount / 1000).toLocaleString('vi-VN')} điểm</strong> cho đơn hàng này</p>
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
