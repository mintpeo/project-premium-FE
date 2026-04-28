import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full">
      {/* Payment Partners Section */}
      <div className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-[1600px] mx-[10%] flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-12 grayscale opacity-80 hover:grayscale-0 transition-all duration-300">
          {/* Momo */}
          <div className="text-pink-600 font-black text-2xl tracking-tighter bg-pink-100 px-3 py-1 rounded-md">momo</div>
          {/* VNPay */}
          <div className="text-blue-600 font-extrabold text-2xl italic tracking-tighter"><span className="text-red-500">VN</span>PAY</div>
          {/* AlePay */}
          <div className="text-orange-500 font-bold text-xl">AlePay</div>
          {/* VietQR */}
          <div className="text-red-600 font-black text-2xl tracking-tighter w-max"><span className="text-blue-800">VIET</span>QR</div>
          {/* Visa */}
          <div className="text-blue-900 font-black text-2xl italic tracking-wider">VISA</div>
          {/* Mastercard */}
          <div className="flex -space-x-2 items-center">
            <div className="w-8 h-8 rounded-full bg-red-500 opacity-80 mix-blend-multiply"></div>
            <div className="w-8 h-8 rounded-full bg-yellow-500 opacity-80 mix-blend-multiply"></div>
          </div>
          {/* Coinbase */}
          <div className="text-blue-600 font-bold text-xl">coinbase</div>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-[#1e2235] pt-16 pb-12 text-[#94a3b8] font-sans text-[15px]">
        <div className="max-w-[1600px] mx-[10%] grid grid-cols-1 md:grid-cols-12 gap-10">

          {/* Column 1: Brand & Contact (Takes 4 columns space) */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex-shrink-0 mb-2">
              <div className="text-[2.5rem] font-black tracking-tighter leading-none italic">
                <span className="text-[#ff7f00]">PREMIUM</span>
                <span className="text-[#e65c00]">KEY</span>
                <span className="text-[#e65c00] text-sm ml-1">.COM</span>
              </div>
            </div>

            <p className="font-medium text-gray-400">Premiumkey | Cửa hàng tài khoản giá rẻ</p>

            {/* Social primary buttons */}
            <div className="flex items-center gap-4 flex-wrap mt-2">
              <button className="flex items-center gap-1.5 text-white font-bold bg-blue-500 px-3 py-1.5 rounded-sm hover:bg-blue-600 transition">
                <span className="w-4 h-4 bg-white text-blue-500 rounded flex items-center justify-center text-[10px]">Z</span>
                Zalo OA
              </button>
              <button className="flex items-center gap-1.5 text-white font-bold bg-[#1877F2] px-3 py-1.5 rounded-sm hover:bg-blue-700 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                facebook
              </button>
              <button className="flex items-center gap-1.5 text-white font-bold bg-[#0088cc] px-3 py-1.5 rounded-sm hover:bg-blue-500 transition">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.11.03-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.52-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.41-1.38-.87.03-.24.32-.49.88-.75 3.46-1.51 5.76-2.5 6.9-2.97 3.28-1.37 3.96-1.61 4.41-1.61.1 0 .32.02.44.11.1.09.13.21.14.33-.01.07.01.18 0 .28z" /></svg>
                Telegram
              </button>
            </div>

            {/* DMCA Badge */}
            <div className="flex bg-[#ffcc00] w-max rounded overflow-hidden mt-2 font-bold text-[#0f172a] text-xs">
              <div className="px-2 py-1 bg-[#fff5cc]">DMCA</div>
              <div className="px-2 py-1">PROTECTED</div>
            </div>

            {/* Minor Social Links */}
            <div className="flex gap-3 text-gray-400 mt-2">
              <span className="w-5 h-5 flex items-center justify-center cursor-pointer hover:text-white">f</span>
              <span className="w-5 h-5 flex items-center justify-center cursor-pointer hover:text-white">D</span>
              <span className="w-5 h-5 flex items-center justify-center cursor-pointer hover:text-white">♪</span>
              <span className="w-5 h-5 flex items-center justify-center cursor-pointer hover:text-white">X</span>
              <span className="w-5 h-5 flex items-center justify-center cursor-pointer hover:text-white">@</span>
            </div>

            {/* Copyright */}
            <p className="text-gray-500 text-sm mt-2">
              Copyright © Premiumkey. All Rights Reserved. Powered by Premiumkey.com
            </p>
          </div>

          {/* Column 2: Navigation (Takes 2 columns) */}
          <div className="col-span-1 md:col-span-2 flex flex-col gap-4 mt-2">
            <a href="#" className="hover:text-white transition">Giới thiệu</a>
            <a href="#" className="hover:text-white transition">Liên hệ</a>
            <a href="#" className="hover:text-white transition">Đánh giá</a>
            <a href="#" className="hover:text-white transition">Tuyển dụng</a>

            {/* Affiliate Program Button */}
            <button className="mt-auto border-2 border-[#334155] rounded hover:border-[#64748b] hover:bg-[#1e293b] text-gray-300 font-bold px-4 py-2 text-sm uppercase tracking-wider transition-colors w-max">
              AFFILIATE PROGRAM
            </button>
          </div>

          {/* Column 3: Policy (Takes 3 columns) */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4 mt-2">
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Bảo hành và hoàn tiền</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Hướng dẫn mua hàng</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Bài viết & tin tức</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> 051095</a>

            {/* Become Supplier Button */}
            <button className="mt-auto border-2 border-[#334155] rounded hover:border-[#64748b] hover:bg-[#1e293b] text-gray-300 font-bold px-4 py-2 text-sm uppercase tracking-wider transition-colors w-max">
              BECOME SUPPLIER
            </button>
          </div>

          {/* Column 4: Main Products (Takes 3 columns) */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-4 mt-2">
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Mua Spotify Premium</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Mua tài khoản Netflix</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Mua Canva Pro vĩnh viễn</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Mua Adobe bản quyền</a>
            <a href="#" className="hover:text-white transition flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-gray-500"></span> Mua Youtube Premium</a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
