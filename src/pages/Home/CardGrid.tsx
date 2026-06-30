import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CardGrid = () => {
    const imageUrls = [
        "https://res.cloudinary.com/askasmg7/image/upload/f_auto,q_auto/ChatGPT_Image_02_34_54_1_thg_7_2026_og5fw4",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848439/ChatGPT_Image_02_36_55_1_thg_7_2026_bm3a8b.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848439/ChatGPT_Image_02_26_49_1_thg_7_2026_zg8sss.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848445/ChatGPT_Image_02_29_11_1_thg_7_2026_olpiwm.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848444/ChatGPT_Image_02_27_47_1_thg_7_2026_wladki.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848442/ChatGPT_Image_02_32_17_1_thg_7_2026_uq18l2.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848439/ChatGPT_Image_02_31_17_1_thg_7_2026_spqedx.png",
        "https://res.cloudinary.com/askasmg7/image/upload/v1782848427/ChatGPT_Image_02_30_18_1_thg_7_2026_pkvjhg.png"
    ];

    const cards = imageUrls.map((url, i) => ({
        id: i,
        image: url, // Lấy url tương ứng từ mảng
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
            slidesPerView: 4,
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
