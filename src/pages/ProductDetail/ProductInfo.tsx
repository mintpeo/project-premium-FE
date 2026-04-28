import React from 'react';
import { List, ChevronDown } from 'lucide-react';

const ProductInfo = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase">Thông tin sản phẩm</h2>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-100 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2 font-bold text-[#334155]">
          <List className="w-5 h-5" />
          NỘI DUNG
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>

      <h3 className="text-[17px] font-bold text-[#1e293b] mb-4 flex items-center gap-2">
        <span className="text-xl">🔥</span> Tài khoản ChatGPT Plus 1 tháng riêng tư - Full quyền, giao ngay <span className="text-xl">🔥</span>
      </h3>

      <p className="text-[#334155] text-[15px] leading-relaxed mb-6">
        Bạn đang tìm kiếm một tài khoản ChatGPT Plus chất lượng, không dùng chung để tối đa hóa hiệu suất công việc?
        Trải nghiệm <strong>tài khoản ChatGPT Plus 1 tháng riêng tư tại Premium Key</strong>. Không bị giới hạn yêu cầu, trải nghiệm tính năng
        DALL-E, GPT-4, phân tích dữ liệu...
      </p>

      <h4 className="font-bold text-[#1e293b] text-[15px] mb-2 flex items-center gap-2">
        🚀 ChatGPT Plus là gì? Có gì vượt trội?
      </h4>

      <div className="flex justify-center mt-6">
        <button className="text-orange-600 font-bold hover:underline flex items-center gap-1">
          Xem thêm <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
