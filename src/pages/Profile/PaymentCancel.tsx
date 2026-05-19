import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { XCircle } from 'lucide-react';

const PaymentCancel = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasCalledAPI = useRef(false);

    useEffect(() => {
        const orderCode = searchParams.get('orderCode');

        if (orderCode && !hasCalledAPI.current) {
            hasCalledAPI.current = true;

            fetch(`http://localhost:8080/api/order/cancel/${orderCode}`, {
                method: 'PUT',
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Đã tự động cập nhật huỷ đơn hàng: ", data);
                })
                .catch(err => {
                    console.error("Lỗi khi huỷ đơn:", err);
                });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen flex flex-col bg-[#F0F4FF] font-sans">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-lg w-full text-center">
                    <div className="flex justify-center mb-6">
                        <XCircle className="text-red-500 w-24 h-24" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Thanh toán thất bại / Đã hủy</h1>
                    <p className="text-gray-600 mb-8">
                        Rất tiếc, giao dịch của bạn chưa được hoàn tất hoặc đã bị hủy. Đơn hàng của bạn sẽ ở trạng thái chờ xác nhận.
                    </p>
                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => navigate('/checkout')} 
                            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition"
                        >
                            Thử lại
                        </button>
                        <button 
                            onClick={() => navigate('/')} 
                            className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
                        >
                            Quay lại trang chủ
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default PaymentCancel;
