import React from 'react';

const categories = [
  {
    name: 'AI',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M4 18h2V6H4v12zm6-12v12h2v-4h2v4h2V6H10zm2 6h2V8h-2v4zM19.5 4l-.8 1.8-1.7.7 1.7.8.8 1.7.7-1.7 1.8-.8-1.8-.7-.7-1.8z" />
      </svg>
    )
  },
  {
    name: 'GAME',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-3c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    )
  },
  {
    name: 'GIAO DỊCH',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
        <path d="M4 20h2v-8H4v8zm4 0h2v-5H8v5zm4 0h2v-7h-2v7zm4 0h2v-4h-2v4z" />
      </svg>
    )
  },
  {
    name: 'BẢO MẬT',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
      </svg>
    )
  },
  {
    name: 'LƯU TRỮ ĐÁM MÂY',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    )
  },
  {
    name: 'HỌC TẬP',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2.12-1.15V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72l5 2.73 5-2.73v3.72z" />
      </svg>
    )
  },
  {
    name: 'GIẢI TRÍ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        {/* Simplified solid masks representation */}
        <path d="M11 20.93c-2.83-.43-5-2.88-5-5.83V9l4.5-1.5L15 9v6.1c0 2.95-2.17 5.4-5 5.83z M7 11h2v2H7v-2zm4 0h2v2h-2v-2zm-2 4h4v1H9v-1z M19 9v6.1c0 2.45-1.48 4.54-3.57 5.43 -1.33-1.63-2.12-3.72-2.12-5.93V9L15 8h4v1z" />
        <path d="M14 6C14 3.79 12.21 2 10 2S6 3.79 6 6v1h8V6z" />
      </svg>
    )
  },
  {
    name: 'NGHE NHẠC',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
      </svg>
    )
  },
  {
    name: 'XEM PHIM',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
      </svg>
    )
  },
  {
    name: 'THỂ THAO',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
      </svg>
    )
  },
  {
    name: 'SỨC KHOẺ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )
  },
  {
    name: 'LÀM VIỆC',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
      </svg>
    )
  },
  {
    name: 'THIẾT KẾ - ĐỒ HOẠ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
        <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1-.23-.27-.38-.62-.38-.98 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9 19 9.67 19 10.5 18.33 12 17.5 12z" />
      </svg>
    )
  }
];

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CategoryIcons = () => {
  return (
    <div className="mx-[10%] py-8 relative group">
      <style dangerouslySetInnerHTML={{__html: `
        .cat-swiper .swiper-button-next, .cat-swiper .swiper-button-prev {
          color: #1e293b;
          background: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          opacity: 0;
          transition: opacity 0.3s;
          margin-top: -16px;
        }
        .cat-swiper .swiper-button-next::after, .cat-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: bold;
        }
        .cat-swiper.swiper-initialized.swiper-horizontal>.swiper-button-disabled {
          opacity: 0 !important;
        }
        .group:hover .cat-swiper .swiper-button-next:not(.swiper-button-disabled), 
        .group:hover .cat-swiper .swiper-button-prev:not(.swiper-button-disabled) {
          opacity: 1;
        }
      `}} />
      <Swiper
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={3}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 5 },
          1024: { slidesPerView: 8 }, // 1 dòng hiển thị 8 component
        }}
        className="cat-swiper w-full px-2 py-4"
      >
        {categories.map((cat, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center cursor-pointer group/icon">
              <div className="text-[#0f172a] group-hover/icon:scale-110 group-hover/icon:text-orange-500 transition-transform duration-300 mb-3">
                {cat.icon}
              </div>
              <span className="text-[#0f172a] text-[12px] font-bold uppercase tracking-wide text-center max-w-[80px]">
                {cat.name}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryIcons;
