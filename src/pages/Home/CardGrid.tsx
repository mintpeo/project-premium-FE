import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CardGrid = () => {
  // Tạo 16 thẻ hình ảnh chuẩn chữ nhật
  const cards = Array.from({ length: 16 }).map((_, i) => ({
    id: i,
    image: `https://picsum.photos/seed/${i + 20}/800/400`, // Ảnh hình chữ nhật
    alt: `Image banner ${i + 1}`
  }));

  return (
    <div className="py-12 mx-[10%] overflow-hidden relative group">
      {/* Container Swiper với custom navigation arrows từ Swiper module */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .card-swiper .swiper-button-next, .card-swiper .swiper-button-prev {
          color: white;
          background: rgba(0,0,0,0.4);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .card-swiper .swiper-button-next::after, .card-swiper .swiper-button-prev::after {
          font-size: 18px;
          font-weight: bold;
        }
        .card-swiper:hover .swiper-button-next, .card-swiper:hover .swiper-button-prev {
          opacity: 1;
        }
      `}} />
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={24}
        slidesPerView={1.5}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 2.5 },
          1024: {
            slidesPerView: 4, // 1 trung tâm, 2 bên cạnh + 2 nửa = 3 rưỡi / 4. Match yêu cầu 3 card ở giữa và 2 nửa 2 bên.
            centeredSlides: true
          },
        }}
        className="w-full card-swiper"
      >
        {cards.map(card => (
          <SwiperSlide key={card.id}>
            <div className="rounded-xl overflow-hidden transition-transform duration-300 shadow-lg cursor-grab active:cursor-grabbing aspect-[2/1] w-full bg-gray-200">
              <img
                src={card.image}
                alt={card.alt}
                className="w-full h-full object-cover transition-transform duration-500 pointer-events-none"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CardGrid;
