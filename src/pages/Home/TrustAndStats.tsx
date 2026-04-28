import React from 'react';

const TrustAndStats = () => {
  return (
    <div className="mx-[10%] pt-8 pb-16 flex flex-col gap-16">
      {/* Hai hình chữ nhật (Banners) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Banner 1 (Màu Xanh lá) */}
        <div className="bg-[#65c123] rounded-[2rem] flex items-center justify-between px-8 py-10 text-white shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <span className="text-xl uppercase font-medium tracking-wider">Mua hàng hôm nay</span>
            <span className="text-[2.2rem] font-extrabold uppercase leading-none tracking-tight">Ưu đãi lớn</span>
          </div>
          {/* Clover Icon */}
          <div className="z-10 ml-4 flex-shrink-0">
            {/* SVG Clover shape close to image */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="white">
              <path d="M12.0003 4.54297C14.7173 1.82597 19.1673 3.63397 19.1673 7.41697V7.66697C19.1673 10.059 17.2253 12.001 14.8333 12.001H14.5833C10.8003 12.001 8.99232 7.55097 11.7093 4.83397L12.0003 4.54297ZM19.4573 12.001C22.1743 9.28397 20.3663 4.83397 16.5833 4.83397H16.3333C13.9413 4.83397 12.0003 6.77597 12.0003 9.16797V9.41797C12.0003 13.201 16.4503 15.009 19.1673 12.292L19.4573 12.001ZM12.0003 19.459C9.28332 22.176 4.83332 20.368 4.83332 16.585V16.335C4.83332 13.943 6.77532 12.001 9.16732 12.001H9.41732C13.2003 12.001 15.0083 16.451 12.2913 19.168L12.0003 19.459ZM4.54332 12.001C1.82632 14.718 3.63432 19.168 7.41732 19.168H7.66732C10.0593 19.168 12.0013 17.226 12.0013 14.834V14.584C12.0013 10.801 7.55132 8.993 4.83432 11.71L4.54332 12.001Z" />
              <path d="M12.0012 11.999C12.0012 11.999 15.3345 15.3324 16.1678 19.499C16.1678 19.499 11.5845 19.499 12.0012 11.999Z" />
            </svg>
          </div>
        </div>

        {/* Banner 2 (Màu Trắng) */}
        <div className="bg-white rounded-[2rem] p-8 flex items-center justify-between gap-6 shadow-sm border border-gray-100 text-[#0f172a]">
          {/* Green Shield */}
          <div className="flex-shrink-0">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="#65c123">
              <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2ZM10.98 16L7.52 12.53L8.93 11.12L10.98 13.17L15.07 9.08L16.48 10.49L10.98 16Z" />
            </svg>
          </div>
          {/* Vertical Title List */}
          <div className="flex text-[1.4rem] flex-col text-left border-r-2 border-gray-100 pr-6 w-max">
            <span className="font-medium tracking-wide">UY TÍN</span>
            <span className="font-bold uppercase">An Toàn</span>
            <span className="font-black uppercase">Nhanh Chóng</span>
          </div>
          {/* Description */}
          <div className="flex-1 text-[1rem] text-gray-500 font-medium leading-relaxed uppercase">
            TẤT CẢ SẢN PHẨM ĐỀU ĐƯỢC KIỂM TRA VÀ BẢO ĐẢM CHO QUÁ TRÌNH SỬ DỤNG ỔN ĐỊNH.
          </div>
        </div>

      </div>

      {/* 4 thống kê */}
      <div className="flex justify-between items-center px-4">

        {/* Stat 1: CTV */}
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="w-[70px] h-[70px] rounded-[24px] border-[2.5px] border-[#ff6a00] flex items-center justify-center text-[#ff6a00] group-hover:bg-[#ff6a00] group-hover:text-white transition-all duration-300 shadow-sm bg-white">
            {/* Store Icon */}
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 6H19V8H5V6ZM4 10H20L19 19H5L4 10ZM3.5 4H20.5V5.5H3.5V4ZM13 12H16V15H13V12ZM8 12H11V15H8V12Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f172a] font-black text-2xl leading-none tracking-tight">4</span>
            <span className="text-gray-500 text-[13px] mt-1 font-medium">CTV</span>
          </div>
        </div>

        {/* Stat 2: Đơn hàng */}
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="w-[70px] h-[70px] rounded-[24px] border-[2.5px] border-[#ff6a00] flex items-center justify-center text-[#ff6a00] group-hover:bg-[#ff6a00] group-hover:text-white transition-all duration-300 shadow-sm bg-white">
            {/* Cart Icon */}
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.24 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.29 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f172a] font-black text-2xl leading-none tracking-tight">1 Tr+</span>
            <span className="text-gray-500 text-[13px] mt-1 font-medium">Đơn hàng</span>
          </div>
        </div>

        {/* Stat 3: REVIEWS */}
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="w-[70px] h-[70px] rounded-[24px] border-[2.5px] border-[#ff6a00] flex items-center justify-center text-[#ff6a00] group-hover:bg-[#ff6a00] group-hover:text-white transition-all duration-300 shadow-sm bg-white">
            {/* Review/Message Icon */}
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM6 9H18V11H6V9ZM14 14H6V12H14V14ZM18 8H6V6H18V8Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f172a] font-black text-lg tracking-wide uppercase">500+</span>
            <span className="text-gray-500 text-[13px] mt-1 font-medium">REVIEWS</span>
          </div>
        </div>

        {/* Stat 4: năm hoạt động */}
        <div className="flex items-center gap-5 group cursor-pointer">
          <div className="w-[70px] h-[70px] rounded-[24px] border-[2.5px] border-[#ff6a00] flex items-center justify-center text-[#ff6a00] group-hover:bg-[#ff6a00] group-hover:text-white transition-all duration-300 shadow-sm bg-white">
            {/* Balloons/Gift Icon */}
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.5 4C14.5 2.9 13.6 2 12.5 2C11.4 2 10.5 2.9 10.5 4C10.5 5.1 11.4 6 12.5 6C13.6 6 14.5 5.1 14.5 4ZM12.5 7C14.43 7 16 8.57 16 10.5C16 12.16 14.83 13.55 13.26 13.92L14.47 19.38L12.52 19.82L12 17.5L11.48 19.82L9.53 19.38L10.74 13.92C9.17 13.55 8 12.16 8 10.5C8 8.57 9.57 7 11.5 7H12.5ZM17.14 7.05C18.66 7.6 19.5 9.28 19.5 10.5C19.5 11.75 18.72 12.82 17.62 13.11L18.42 16.7L17.22 17L16.82 15.22C16.63 14.89 16.37 14.61 16.03 14.43C16.7 13.43 17 12.06 17 10.5C17 9.54 16.79 8.64 16.43 7.85L17.14 7.05ZM6.86 7.05L7.57 7.85C7.21 8.64 7 9.54 7 10.5C7 12.06 7.3 13.43 7.97 14.43C7.63 14.61 7.37 14.89 7.18 15.22L6.78 17L5.58 16.7L6.38 13.11C5.28 12.82 4.5 11.75 4.5 10.5C4.5 9.28 5.34 7.6 6.86 7.05Z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f172a] font-black text-2xl leading-none tracking-tight">5 năm</span>
            <span className="text-gray-500 text-[13px] mt-1 font-medium">hoạt động</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrustAndStats;
