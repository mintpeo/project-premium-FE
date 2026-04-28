import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const REVIEWS = [
  { 
    id: 1, avatar: 'N', bg: 'bg-[#fbbf24]', name: 'Nhung', type: 'Thành viên', likes: 3, 
    date: '21/02/2025 17:19', stars: 5, ratingText: 'Cực kì hài lòng', 
    content: 'Đã mua từ 5/11/2023. Bị remove khỏi team 2 lần. Shop xử lí nhanh chóng cho mình vào team khác nhưng mất toàn bộ dữ liệu. Cần phải link thẻ cứng sang team mới, các bạn dùng thì tốt nhất nên backup đầu đó cho chắc nhé.',
    reply: null
  },
  {
    id: 2, avatar: 'XP', bg: 'bg-[#fbbf24]', name: 'Xuân Phúc', type: '083.2553.xxx', likes: 2,
    date: '08/01/2025 14:33', stars: 5, ratingText: 'Cực kì hài lòng',
    content: 'Uy tín nha. Đòi hỏi lâu tường lừa đảo không đó.',
    reply: null
  },
  {
    id: 3, avatar: 'F', bg: 'bg-[#fbbf24]', name: 'Fffff', type: '034.4567.xxx', likes: 0,
    date: '05/11/2024 14:07', stars: 4, ratingText: 'Hài lòng',
    content: '11111111111111111111111111',
    reply: null
  },
  {
    id: 4, avatar: 'T', bg: 'bg-[#fbbf24]', name: 'Thịnh', type: 'Thành viên', likes: 2,
    date: '12/11/2023 11:05', stars: 5, ratingText: 'Cực kì hài lòng',
    content: '- Đã mua và dùng được hơn 4 tháng.\n- Shop tư vấn và hỗ trợ nhiệt tình.\n- Trong thời gian sử dụng gặp vấn đề cũ được bảo hành nhanh chóng.',
    reply: null
  },
  {
    id: 5, avatar: 'KT', bg: 'bg-[#fbbf24]', name: 'Ky Thoai', type: '090.4227.xxx', likes: 1,
    date: '21/10/2023 05:32', stars: 4, ratingText: 'Hài lòng',
    content: 'Support nhiệt tình hỗ trợ',
    reply: null
  },
  {
    id: 6, avatar: 'TM', bg: 'bg-[#fbbf24]', name: 'Thanh Tuyết Đồ Mỹ', type: '076.2665.xxx', likes: 0,
    date: '10/08/2023 08:52', stars: 5, ratingText: 'Cực kì hài lòng',
    content: 'Nâng cấp chưa tới 3p, shop uy tín',
    reply: {
      date: '16/08/2023 12:45', content: 'Rất cảm ơn đánh giá tích cực của anh/chị. Chúng tôi sẽ cố gắng cung cấp dịch vụ tốt hơn.'
    }
  }
];

const ProductReviews = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col mt-4 mb-10">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase">Đánh giá - nhận xét từ khách hàng</h2>

      {/* Overview */}
      <div className="border border-gray-100 rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
        <div className="flex flex-col flex-1 w-full md:border-r border-gray-100 pr-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[48px] font-black text-[#1e293b] leading-none">5</span>
            <div className="flex flex-col">
              <div className="flex text-[#fbbf24] text-[18px] tracking-widest">★★★★★</div>
              <span className="text-[13px] text-gray-500 font-medium mt-1">49 đánh giá</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 w-full mt-2">
            <div className="flex items-center gap-3">
              <div className="flex text-[#fbbf24] text-[12px] w-[60px] justify-end">★★★★★</div>
              <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 bg-gray-600 w-[96%]"></div>
              </div>
              <span className="text-[12px] text-gray-500 w-[20px]">47</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex text-[#fbbf24] text-[12px] w-[60px] justify-end">★★★★<span className="text-gray-200">★</span></div>
              <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden relative">
                <div className="absolute top-0 bottom-0 left-0 bg-gray-600 w-[4%]"></div>
              </div>
              <span className="text-[12px] text-gray-500 w-[20px]">2</span>
            </div>
            {[3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-3">
                <div className="flex text-[#fbbf24] text-[12px] w-[60px] justify-end">
                  {'★'.repeat(star)}
                  <span className="text-gray-200">{'★'.repeat(5-star)}</span>
                </div>
                <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden"></div>
                <span className="text-[12px] text-gray-500 w-[20px]">0</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col justify-center items-center flex-1 w-full md:border-r border-gray-100 px-4 h-full min-h-[100px]">
          <span className="text-gray-500 font-medium text-[14px]">Hình ảnh đánh giá</span>
        </div>

        <div className="flex flex-col justify-center items-center flex-1 w-full">
          <button className="bg-[#1e90ff] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded shadow-sm transition text-sm">
            Gửi đánh giá của bạn
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center flex-wrap gap-3 mb-8 border-b border-gray-100 pb-6">
        <span className="text-[#334155] font-medium text-[14px] mr-2">Lọc xem theo:</span>
        <button className="bg-gray-100 hover:bg-gray-200 text-[#334155] px-4 py-1.5 rounded-full text-[13px] font-medium transition">Có hình ảnh</button>
        <button className="bg-gray-100 hover:bg-gray-200 text-[#334155] px-4 py-1.5 rounded-full text-[13px] font-medium transition">Đã mua hàng</button>
        {[5,4,3,2,1].map(num => (
          <button key={num} className="bg-gray-100 hover:bg-gray-200 text-[#334155] px-4 py-1.5 rounded-full text-[13px] font-medium transition flex items-center gap-1">
            {num} <Star size={12} className="text-[#fbbf24] fill-[#fbbf24]" />
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="flex flex-col gap-6">
         {REVIEWS.map((review) => (
            <div key={review.id} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 w-full">
              {/* Reviewer Info */}
              <div className="w-[200px] shrink-0 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${review.bg} rounded-full flex items-center justify-center font-bold text-white text-[15px]`}>
                    {review.avatar}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1e293b] text-[14px]">{review.name}</span>
                    <span className="text-[12px] text-gray-500">{review.type}</span>
                  </div>
                </div>
                <div className="flex items-center justify-start gap-1 text-[12px] text-gray-400 mt-1 pl-1">
                  Đã nhận: {review.likes} lượt thích
                </div>
              </div>
              
              {/* Review Content */}
              <div className="flex-1 flex flex-col pt-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex text-[#fbbf24] text-[13px] tracking-widest leading-none">
                    {'★'.repeat(review.stars)}
                    <span className="text-gray-200">{'★'.repeat(5-review.stars)}</span>
                  </div>
                  <span className="font-bold text-[#334155] text-[14px]">{review.ratingText}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckCircle2 size={12} className="text-[#10b981]" />
                  <span className="text-[12px] text-[#10b981] font-medium">Đã mua từ Premiumkey</span>
                </div>
                <p className="text-[14px] text-[#334155] leading-relaxed mb-1 whitespace-pre-line">
                  {review.content}
                </p>
                <span className="text-[12px] text-gray-400 mb-3 block">Nhận xét vào {review.date}</span>
                
                <div className="flex items-center gap-4 mb-4">
                  <button className="flex items-center gap-1.5 border border-blue-200 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded text-[12px] font-bold transition">
                    Like
                  </button>
                  <button className="text-blue-500 font-bold text-[13px] hover:underline">Gửi trả lời</button>
                </div>

                {review.reply && (
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0">
                        P
                      </div>
                      <span className="text-[13px] font-bold text-[#1e293b] flex items-center gap-1">
                        Premiumkey Support 
                      </span>
                      <span className="text-[12px] text-gray-400">• {review.reply.date}</span>
                    </div>
                    <p className="text-[13px] text-gray-600 leading-relaxed pl-8">
                      {review.reply.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
         ))}
      </div>

      <div className="flex justify-center mt-10 gap-2">
         {[1, 2, 3, 4, 5, '>'].map(p => (
           <button key={p} className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-medium transition cursor-pointer ${p === 1 ? 'bg-[#3b82f6] text-white font-bold shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
             {p}
           </button>
         ))}
      </div>
    </div>
  );
};

export default ProductReviews;
