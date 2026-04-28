import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';

const Profile = () => {
  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
      {/* Background patterns */}
      <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>

      <Header />

      <main className="flex-1 max-w-[1200px] w-full mx-auto flex flex-col md:flex-row gap-6 pt-12 pb-24 px-4 relative z-10">

        {/* Left Sidebar */}
        <div className="w-full md:w-[280px] shrink-0">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden py-1">
            {/* User Info Header */}
            <div className="p-6 pb-5 flex items-center gap-4">
              <div className="w-[52px] h-[52px] bg-[#7552cc] rounded-full flex items-center justify-center text-white text-2xl font-normal">
                K
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-[#0d6efd] font-bold text-[17px]">Khoi</span>
                <span className="text-[#8bb2f9] text-[13px] font-medium">#49865</span>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex flex-col pb-2 text-[#334155] font-semibold text-[14px]">

              <div className="flex items-center gap-3 px-6 py-3 border-l-[3px] border-[#0d6efd] text-[#0d6efd] cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                Trang tài khoản
              </div>

              <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 border-t border-gray-100 text-[#4b5563] cursor-pointer relative after:absolute after:bottom-0 after:left-8 after:right-8 after:h-[1px] after:bg-gray-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 4H3C1.895 4 1 4.895 1 6v12c0 1.105.895 2 2 2h18c1.105 0 2-.895 2-2V6c0-1.105-.895-2-2-2zM3 6h18v2H3V6zm0 12v-8h18v8H3zm3-3h6v2H6v-2z" /></svg>
                Đơn hàng
              </div>

              <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-[#4b5563] cursor-pointer relative after:absolute after:bottom-0 after:left-8 after:right-8 after:h-[1px] after:bg-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0v2H4V6h16zm0 12H4v-8h16v8zM16 13h2v2h-2v-2z" /></svg>
                Ví của tôi
              </div>

              <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-[#4b5563] cursor-pointer relative after:absolute after:bottom-0 after:left-8 after:right-8 after:h-[1px] after:bg-gray-100">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                Cộng tác viên
              </div>

              <div className="flex items-center gap-3 px-6 py-3.5 hover:bg-gray-50 text-[#4b5563] cursor-pointer">
                <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" /></svg>
                Thoát
              </div>

            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-8">

          <h2 className="text-[19px] font-bold text-[#1e293b] mb-6">Tổng quan</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 gap-y-8 border-b border-gray-100 pb-12 mb-10">
            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-gray-500 font-medium">Họ tên</span>
              <span className="font-bold text-[#1e293b] text-[15px]">Khoi</span>
            </div>

            <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
              <span className="text-[13px] text-gray-500 font-medium">Email</span>
              <span className="font-bold text-[#1e293b] text-[15px]">studentnlu22@gmail.com</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-gray-500 font-medium">Số điện thoại</span>
              <span className="font-bold text-[#1e293b] text-[15px]"></span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-gray-500 font-medium">Số tiền chi tiêu</span>
              <span className="font-bold text-[#1e293b] text-[15px]">0đ</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[13px] text-gray-500 font-medium">Đơn hàng đã đặt</span>
              <span className="font-bold text-[#1e293b] text-[15px]">0</span>
            </div>
          </div>

          <h2 className="text-[19px] font-bold text-[#1e293b] mb-4">Đơn hàng của bạn</h2>

          <div className="text-[#334155] text-[15px] font-medium">
            No orders found for this user.
          </div>

        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Profile;
