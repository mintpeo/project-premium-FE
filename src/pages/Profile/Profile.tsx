import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';
import {useAuth} from '../../context/AuthContext';
import {Clock, Key, ShieldCheck, XCircle, CheckCircle} from "lucide-react";

interface UserProfile {
    id: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    role: string;
    createdAt: string;
}

interface OrderItemResponse {
    productId?: number;
    productName: string;
    quantity: number;
    price: number;
    productImg: string;
    keyCode?: string;
}

interface OrderResponse {
    orderId: string;
    createdAt: string;
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELLED';
    totalPrice: number;
    items: OrderItemResponse[];
}

const Profile = () => {
    const {user, logout, isLoggedIn, updateUser} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState<'overview' | 'order' | 'edit' | 'password'>('overview');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELLED' | ''>('');
    const [orderLoading, setOrderLoading] = useState(false);
    const [orderCounts, setOrderCounts] = useState({PENDING: 0, PROCESSING: 0, SUCCESS: 0, CANCELLED: 0});

    // Edit form
    const [editForm, setEditForm] = useState({fullName: '', phoneNumber: ''});
    const [editLoading, setEditLoading] = useState(false);

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    const [showKeyForOrder, setShowKeyForOrder] = useState<string | null>(null);

    // Review Modal
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewData, setReviewData] = useState({productId: 0, productName: '', stars: 5, content: ''});
    const [reviewLoading, setReviewLoading] = useState(false);

    // Cancel Modal
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
    const [cancelSuccessModalOpen, setCancelSuccessModalOpen] = useState(false);

    useEffect(() => {
        // If navigating from PaymentSuccess, switch to order tab
        if (location.state && location.state.tab === 'order') {
            setActiveTab('order');
            // clear location state to avoid switching back on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    useEffect(() => {
        if (!isLoggedIn || !user) {
            navigate('/auth');
            return;
        }
        fetchProfile();
    }, [isLoggedIn, user, navigate]);

    useEffect(() => {
        if (activeTab === 'order' && user) {
            fetchOrderCounts();
        }
    }, [activeTab, user]);

    const fetchProfile = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/user/profile/${user.id}`);
            const data = await res.json();
            if (data.success) {
                setProfile(data.data);
                if (data.data.role && data.data.role !== user?.role) {
                    updateUser({ role: data.data.role });
                }
                setEditForm({
                    fullName: data.data.fullName || '',
                    phoneNumber: data.data.phoneNumber || '',
                });
            } else {
                setError(data.message);
            }
        } catch {
            setError('Không thể tải thông tin. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const fetchOrderCounts = async () => {
        if (!user) return;
        try {
            const [resPending, resProcessing, resSuccess, resCancelled] = await Promise.all([
                fetch(`http://localhost:8080/api/order/history?userId=${user.id}&status=PENDING`),
                fetch(`http://localhost:8080/api/order/history?userId=${user.id}&status=PROCESSING`),
                fetch(`http://localhost:8080/api/order/history?userId=${user.id}&status=SUCCESS`),
                fetch(`http://localhost:8080/api/order/history?userId=${user.id}&status=CANCELLED`)
            ]);

            const dataPending = resPending.ok ? await resPending.json() : [];
            const dataProcessing = resProcessing.ok ? await resProcessing.json() : [];
            const dataSuccess = resSuccess.ok ? await resSuccess.json() : [];
            const dataCancelled = resCancelled.ok ? await resCancelled.json() : [];

            setOrderCounts({
                PENDING: Array.isArray(dataPending) ? dataPending.length : 0,
                PROCESSING: Array.isArray(dataProcessing) ? dataProcessing.length : 0,
                SUCCESS: Array.isArray(dataSuccess) ? dataSuccess.length : 0,
                CANCELLED: Array.isArray(dataCancelled) ? dataCancelled.length : 0
            });
        } catch (err) {
            console.error("Lỗi khi đếm số lượng đơn hàng:", err);
        }
    };

    const handleFetchOrders = async (status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'CANCELLED') => {
        if (!user) return;
        setOrderStatus(status); // Đánh dấu icon đang chọn
        setOrderLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/order/history?userId=${user.id}&status=${status}`);
            if (!res.ok) {
                throw new Error("Lỗi máy chủ");
            }
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch {
            setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại.');
        } finally {
            setOrderLoading(false);
        }
    };

    const handleRepay = async (orderId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/order/repay/${orderId}`, {
                method: 'POST'
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Server không trả về JSON");
            }

            const data = await response.json();

            if (response.ok && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                alert(data.error || "Không thể tạo lại link thanh toán.");
            }
        } catch (error) {
            console.error("Lỗi khi thanh toán lại:", error);
            alert("Đã xảy ra lỗi kết nối đến server!");
        }
    };

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        try {
            const res = await fetch(`http://localhost:8080/api/order/cancel/${orderToCancel}`, {
                method: 'PUT'
            });
            const data = await res.json();
            if (res.ok) {
                setCancelSuccessModalOpen(true);
                if (orderStatus) {
                    handleFetchOrders(orderStatus as 'PENDING' | 'PROCESSING' | 'SUCCESS');
                }
                fetchOrderCounts();
                localStorage.setItem('order_update', Date.now().toString());
                window.dispatchEvent(new CustomEvent('order-update'));
            } else {
                alert("Lỗi: " + (data.error || "Không thể huỷ đơn hàng"));
            }
        } catch (error) {
            alert("Đã có lỗi xảy ra khi kết nối với máy chủ.");
        } finally {
            setCancelModalOpen(false);
            setOrderToCancel(null);
        }
    };

    const handleOpenReview = (productId: number, productName: string) => {
        setReviewData({productId, productName, stars: 5, content: ''});
        setReviewModalOpen(true);
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setReviewLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/review`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    productId: reviewData.productId,
                    userId: user.id,
                    stars: reviewData.stars,
                    content: reviewData.content
                })
            });
            if (res.ok) {
                alert("Cảm ơn bạn đã đánh giá sản phẩm!");
                setReviewModalOpen(false);
            } else {
                alert("Có lỗi xảy ra khi gửi đánh giá.");
            }
        } catch (err) {
            alert("Lỗi kết nối máy chủ");
        } finally {
            setReviewLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError('');
        setSuccess('');
        setEditLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/user/profile/${user.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (data.success) {
                setProfile(data.data);
                setSuccess('Cập nhật thông tin thành công!');
                setActiveTab('overview');
            } else {
                setError(data.message);
            }
        } catch {
            setError('Không thể cập nhật. Vui lòng thử lại.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setError('');
        setSuccess('');
        setPasswordLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/api/user/change-password/${user.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(passwordForm),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess('Đổi mật khẩu thành công!');
                setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''});
                setActiveTab('overview');
            } else {
                setError(data.message);
            }
        } catch {
            setError('Không thể đổi mật khẩu. Vui lòng thử lại.');
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#edf3f6] flex items-center justify-center">
                <div className="text-lg text-gray-600">Đang tải...</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#edf3f6] flex items-center justify-center">
                <div className="text-lg text-red-600">Không thể tải thông tin người dùng</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
            <div
                className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
            <div
                className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>

            <Header/>

            <main
                className="flex-1 max-w-[1200px] w-full mx-auto flex flex-col md:flex-row gap-6 pt-12 pb-24 px-4 relative z-10">
                {/* Left Sidebar */}
                <div className="w-full md:w-[280px] shrink-0">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden py-1">
                        <div className="p-6 pb-5 flex items-center gap-4">
                            <div
                                className="w-[52px] h-[52px] bg-[#7552cc] rounded-full flex items-center justify-center text-white text-2xl font-normal">
                                {profile.fullName?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col">
                                <span
                                    className="text-[#0d6efd] font-bold text-[17px]">{profile.fullName || 'User'}</span>
                                <span className="text-[#8bb2f9] text-[13px] font-medium">#{profile.id}</span>
                            </div>
                        </div>

                        <div className="flex flex-col pb-2 text-[#334155] font-semibold text-[14px]">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-3 px-6 py-3 border-l-[3px] ${
                                    activeTab === 'overview'
                                        ? 'border-[#0d6efd] text-[#0d6efd]'
                                        : 'border-transparent text-[#4b5563] hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                                </svg>
                                Tổng quan
                            </button>

                            <button
                                onClick={() => setActiveTab('order')}
                                className={`flex items-center gap-3 px-6 py-3 border-l-[3px] ${
                                    activeTab === 'order'
                                        ? 'border-[#0d6efd] text-[#0d6efd]'
                                        : 'border-transparent text-[#4b5563] hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"/>
                                    <path fillRule="evenodd"
                                          d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                          clipRule="evenodd"/>
                                </svg>
                                Đơn hàng
                            </button>

                            <button
                                onClick={() => setActiveTab('edit')}
                                className={`flex items-center gap-3 px-6 py-3.5 border-t border-gray-100 ${
                                    activeTab === 'edit'
                                        ? 'border-l-[3px] border-[#0d6efd] text-[#0d6efd]'
                                        : 'border-l-[3px] border-transparent text-[#4b5563] hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                Chỉnh sửa thông tin
                            </button>

                            <button
                                onClick={() => setActiveTab('password')}
                                className={`flex items-center gap-3 px-6 py-3.5 border-t border-gray-100 ${
                                    activeTab === 'password'
                                        ? 'border-l-[3px] border-[#0d6efd] text-[#0d6efd]'
                                        : 'border-l-[3px] border-transparent text-[#4b5563] hover:bg-gray-50'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/>
                                </svg>
                                Đổi mật khẩu
                            </button>

                            {profile.role === 'ADMIN' && (
                                <button
                                    onClick={() => navigate('/admin/dashboard')}
                                    className={`flex items-center gap-3 px-6 py-3.5 border-t border-gray-100 ${
                                        location.pathname.startsWith('/admin')
                                            ? 'border-l-[3px] border-[#0d6efd] text-[#0d6efd]'
                                            : 'border-l-[3px] border-transparent text-[#4b5563] hover:bg-gray-50'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 4h7v7H4V4zm0 9h7v7H4v-7zm9-9h7v7h-7V4zm0 9h7v7h-7v-7z"/>
                                    </svg>
                                    Quản trị
                                </button>
                            )}

                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-6 py-3.5 border-t border-gray-100 text-red-600 hover:bg-red-50"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                                </svg>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 bg-white rounded-lg shadow-sm p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                            {success}
                        </div>
                    )}

                    {activeTab === 'overview' && (
                        <>
                            <h2 className="text-[19px] font-bold text-[#1e293b] mb-6">Thông tin tài khoản</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-100 pb-8 mb-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-500 font-medium">Họ tên</span>
                                    <span
                                        className="font-bold text-[#1e293b] text-[15px]">{profile.fullName || '—'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-500 font-medium">Email</span>
                                    <span className="font-bold text-[#1e293b] text-[15px]">{profile.email}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-500 font-medium">Số điện thoại</span>
                                    <span
                                        className="font-bold text-[#1e293b] text-[15px]">{profile.phoneNumber || '—'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-500 font-medium">Vai trò</span>
                                    <span className="font-bold text-[#1e293b] text-[15px]">
                    {profile.role === 'ADMIN' ? 'Quản trị viên' : profile.role === 'SELLER' ? 'Người bán' : 'Khách hàng'}
                  </span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-500 font-medium">Ngày tạo</span>
                                    <span className="font-bold text-[#1e293b] text-[15px]">
                    {new Date(profile.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'order' && (
                        <>
                            <div
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 grid grid-cols-4 gap-2 mb-6 text-center">

                                {/* ICON 1: CHỜ XÁC NHẬN */}
                                <button
                                    onClick={() => handleFetchOrders('PENDING')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition relative ${
                                        orderStatus === 'PENDING' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                >
                                    {orderCounts.PENDING > 0 && (
                                        <span
                                            className="absolute top-1 right-6 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                                            {orderCounts.PENDING}
                                        </span>
                                    )}
                                    <Clock className="w-5 h-5 mb-1"/>
                                    <span className="text-xs font-medium">Chờ xác nhận</span>
                                </button>

                                {/* ICON 2: ĐANG XỬ LÝ KÈM */}
                                <button
                                    onClick={() => handleFetchOrders('PROCESSING')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition relative ${
                                        orderStatus === 'PROCESSING' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                >
                                    {orderCounts.PROCESSING > 0 && (
                                        <span
                                            className="absolute top-1 right-8 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                                            {orderCounts.PROCESSING}
                                        </span>
                                    )}
                                    <Key className="w-5 h-5 mb-1"/>
                                    <span className="text-xs font-medium">Đang xử lý</span>
                                </button>

                                {/* ICON 3: LỊCH SỬ & ĐÁNH GIÁ KÈM */}
                                <button
                                    onClick={() => handleFetchOrders('SUCCESS')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition relative ${
                                        orderStatus === 'SUCCESS' ? 'text-blue-600 bg-blue-50 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                                    }`}
                                >
                                    {orderCounts.SUCCESS > 0 && (
                                        <span
                                            className="absolute top-1 right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                                            {orderCounts.SUCCESS}
                                        </span>
                                    )}
                                    <ShieldCheck className="w-5 h-5 mb-1"/>
                                    <span className="text-xs font-medium">Lịch sử & Đánh giá</span>
                                </button>
                                {/* ICON 4: ĐÃ HỦY */}
                                <button
                                    onClick={() => handleFetchOrders('CANCELLED')}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition relative ${
                                        orderStatus === 'CANCELLED' ? 'text-red-600 bg-red-50 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-red-600'
                                    }`}
                                >
                                    {orderCounts.CANCELLED > 0 && (
                                        <span
                                            className="absolute top-1 right-4 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px]">
                                            {orderCounts.CANCELLED}
                                        </span>
                                    )}
                                    <XCircle className="w-5 h-5 mb-1"/>
                                    <span className="text-xs font-medium">Đã huỷ</span>
                                </button>
                            </div>

                            {/* --- ĐOẠN HIỂN THỊ DỮ LIỆU ĐƠN HÀNG ĐỘNG --- */}

                            {/* 1. Trạng thái đang tải dữ liệu */}
                            {orderLoading && (
                                <div className="text-center py-10 text-gray-500">Đang tải danh sách đơn hàng...</div>
                            )}

                            {/* 2. Mới vào mục đơn hàng (chưa chọn icon nào) */}
                            {!orderStatus && !orderLoading && (
                                <div
                                    className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    Vui lòng chọn trạng thái ở trên để bắt đầu xem đơn hàng.
                                </div>
                            )}

                            {/* 3. Đã chọn trạng thái nhưng mảng đơn hàng trống */}
                            {orderStatus && !orderLoading && orders.length === 0 && (
                                <div
                                    className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    Bạn chưa có đơn hàng nào ở trạng thái này.
                                </div>
                            )}

                            {/* 4. Đã có dữ liệu -> Duyệt mảng vẽ danh sách các Card đơn hàng thật */}
                            {!orderLoading && orders.length > 0 && orders.map((order) => (
                                <div key={order.orderId}
                                     className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-4 last:mb-0">
                                    {/* Header của Đơn hàng */}
                                    <div
                                        className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                                        <div>
                                            <span
                                                className="font-semibold text-gray-800">Đơn hàng #PK-{order.orderId}</span>
                                            <span className="text-sm text-gray-500 ml-3">
                                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        {/* Status Badge hiển thị chữ tiếng Việt tương ứng trạng thái */}
                                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                            order.status === 'SUCCESS' ? 'bg-green-50 text-green-600' :
                                                order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' : order.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                        }`}>
                                            {order.status === 'SUCCESS' ? 'Đã giao' : order.status === 'PROCESSING' ? 'Đang xử lý' : order.status === 'PENDING' ? 'Chờ xác nhận' : 'Đã huỷ'}
                                        </span>
                                    </div>

                                    {/* Body: Danh sách các sản phẩm (items) nằm trong Đơn hàng đó */}
                                    {order.items && order.items.map((item, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 mb-4 last:mb-0">
                                            <img
                                                src={item.productImg || "/assets/netflix-logo.png"}
                                                alt="Product"
                                                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-800 text-sm">{item.productName}</h4>
                                                <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className="font-semibold text-gray-800 text-sm">
                                                    {item.price.toLocaleString('vi-VN')}đ
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Footer đơn hàng */}
                                    <div
                                        className="flex justify-between items-center border-t border-gray-100 mt-4 pt-4">
                                        <div className="text-sm text-gray-600">
                                            Tổng thanh toán: <span
                                            className="font-bold text-red-500 text-base">{order.totalPrice.toLocaleString('vi-VN')}đ</span>
                                        </div>
                                        {/* Nút hành động tương tác */}
                                        <div className="space-x-2">
                                            <button
                                                className="px-4 py-2 text-xs border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50">
                                                Liên hệ hỗ trợ
                                            </button>
                                            {(order.status === 'PENDING' || order.status === 'PROCESSING') && (
                                                <button
                                                    onClick={() => {
                                                        setOrderToCancel(order.orderId);
                                                        setCancelModalOpen(true);
                                                    }}
                                                    className="px-4 py-2 text-xs border border-red-200 text-red-600 rounded-lg hover:bg-red-50">
                                                    Huỷ đơn
                                                </button>
                                            )}
                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleRepay(order.orderId)}
                                                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow"
                                                >
                                                    Thanh toán ngay
                                                </button>
                                            )}
                                            {/* Chỉ hiện nút xem Mật khẩu / Key nếu đơn hàng đã giao thành công */}
                                            {order.status === 'SUCCESS' && (
                                                <>
                                                    {order.items.length > 0 && order.items[0].productId && (
                                                        <button
                                                            onClick={() => handleOpenReview(order.items[0].productId!, order.items[0].productName)}
                                                            className="px-4 py-2 text-xs border border-amber-200 text-amber-600 rounded-lg hover:bg-amber-50 transition"
                                                        >
                                                            Đánh giá
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setShowKeyForOrder(showKeyForOrder === order.orderId ? null : order.orderId)}
                                                        className="px-4 py-2 text-xs bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-sm">
                                                        {showKeyForOrder === order.orderId ? 'Đóng' : 'Xem mật khẩu / Key'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hiển thị Key code nếu user click Xem */}
                                    {showKeyForOrder === order.orderId && order.status === 'SUCCESS' && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-800 mb-3">Thông tin Key / Tài
                                                khoản</h4>
                                            {order.items && order.items.map((item, idx) => (
                                                <div key={idx}
                                                     className="mb-2 last:mb-0 flex items-center justify-between bg-white p-3 border border-gray-200 rounded text-sm">
                                                    <span
                                                        className="text-gray-600 font-medium truncate flex-1">{item.productName}</span>
                                                    <div className="ml-4 flex items-center gap-2">
                                                        <span
                                                            className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                                            {item.keyCode ? item.keyCode : 'Chưa có Key'}
                                                        </span>
                                                        <button
                                                            onClick={() => item.keyCode && navigator.clipboard.writeText(item.keyCode)}
                                                            className="text-gray-400 hover:text-blue-600 transition"
                                                            title="Sao chép"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                                 viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                                      strokeWidth={2}
                                                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </>
                    )}

                    {activeTab === 'edit' && (
                        <>
                            <h2 className="text-[19px] font-bold text-[#1e293b] mb-6">Chỉnh sửa thông tin</h2>
                            <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.fullName}
                                        onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-2">Số điện
                                        thoại</label>
                                    <input
                                        type="tel"
                                        value={editForm.phoneNumber}
                                        onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="bg-[#0d6efd] hover:bg-[#0b5ed7] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg text-[14px]"
                                    >
                                        {editLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('overview')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg text-[14px]"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </>
                    )}

                    {activeTab === 'password' && (
                        <>
                            <h2 className="text-[19px] font-bold text-[#1e293b] mb-6">Đổi mật khẩu</h2>
                            <form onSubmit={handleChangePassword} className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                                        Mật khẩu hiện tại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            currentPassword: e.target.value
                                        })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                                        Mật khẩu mới <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            newPassword: e.target.value
                                        })}
                                        required
                                        minLength={6}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[14px] font-medium text-gray-700 mb-2">
                                        Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({
                                            ...passwordForm,
                                            confirmPassword: e.target.value
                                        })}
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-[15px] focus:outline-none focus:border-blue-500 text-gray-900"
                                    />
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="bg-[#0d6efd] hover:bg-[#0b5ed7] disabled:opacity-60 text-white font-medium px-6 py-2.5 rounded-lg text-[14px]"
                                    >
                                        {passwordLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('overview')}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg text-[14px]"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Cancel Confirmation Modal */}
                {cancelModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl max-w-[360px] w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                    <XCircle className="w-8 h-8 text-red-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận huỷ đơn</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                                    Bạn có chắc chắn muốn huỷ đơn hàng này không? Hành động này không thể hoàn tác.
                                </p>
                                <div className="flex w-full gap-3">
                                    <button
                                        onClick={() => {
                                            setCancelModalOpen(false);
                                            setOrderToCancel(null);
                                        }}
                                        className="flex-1 py-2.5 font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                    >
                                        Đóng
                                    </button>
                                    <button
                                        onClick={confirmCancelOrder}
                                        className="flex-1 py-2.5 font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition shadow-sm"
                                    >
                                        Huỷ đơn
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cancel Success Modal */}
                {cancelSuccessModalOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-xl shadow-xl max-w-[360px] w-full p-6 animate-in fade-in zoom-in duration-200">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Huỷ đơn thành công</h3>
                                <p className="text-gray-500 text-[14px] leading-relaxed mb-6">
                                    Đơn hàng của bạn đã được huỷ thành công.
                                </p>
                                <button
                                    onClick={() => setCancelSuccessModalOpen(false)}
                                    className="w-full py-2.5 font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition shadow-sm"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Review Modal */}
            {reviewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-800">Đánh giá sản phẩm</h3>
                            <button onClick={() => setReviewModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSubmitReview} className="p-4 space-y-4">
                            <p className="text-sm text-gray-600 font-medium truncate">{reviewData.productName}</p>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Chất lượng (1-5
                                    sao)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewData({...reviewData, stars: star})}
                                            className={`text-2xl ${reviewData.stars >= star ? 'text-amber-400' : 'text-gray-300'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh
                                    giá</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={reviewData.content}
                                    onChange={e => setReviewData({...reviewData, content: e.target.value})}
                                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm này..."
                                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 mt-4">
                                <button type="button" onClick={() => setReviewModalOpen(false)}
                                        className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                                    Hủy
                                </button>
                                <button type="submit" disabled={reviewLoading}
                                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                    {reviewLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer/>
            <FloatingActions/>
        </div>
    );
};

export default Profile;
