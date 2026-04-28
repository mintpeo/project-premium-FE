import React from 'react';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

const ProductDescription = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col mt-2">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase">Mô tả ngắn sản phẩm</h2>

      <div className="prose prose-sm max-w-none text-[#334155] leading-relaxed">
        <p className="flex items-center gap-2 font-bold text-[15px] mb-2"><span className="text-xl">🔥</span> Truy cập AI cao cấp - Giao ngay - Toàn quyền sử dụng <span className="text-xl">🔥</span></p>
        <p className="mb-6 text-[15px]">ChatGPT Plus 4.0 - Tài khoản cá nhân riêng tư 1 tháng</p>

        <ul className="mb-6 space-y-1">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">🔹</span>
            <span>TÍNH THỨC GIAO HÀNG (CUNG CẤP TÀI KHOẢN ĐĂNG NHẬP)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">⚡</span>
            <span>Giao ngay tài khoản để bạn sử dụng ngay sau khi thanh toán thành công.</span>
          </li>
        </ul>

        <h3 className="font-bold text-[16px] flex items-center gap-2 mt-8 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          LÝ DO NÊN CHỌN PREMIUM KEY
        </h3>
        <ul className="space-y-2 mb-8">
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Tài khoản độc lập 100% không dùng chung</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Bảo hành trọn vẹn trong quá trình sử dụng</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Hỗ trợ kỹ thuật nhanh chóng, tận tâm</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Thanh toán linh hoạt, tự động cấp tài khoản</li>
        </ul>

        <h3 className="font-bold text-[16px] flex items-center gap-2 mt-8 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          LƯU Ý QUAN TRỌNG
        </h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-red-600 font-medium"><CheckCircle2 className="w-4 h-4" /> Thời gian xử lý: 1-5 phút</li>
          <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Vui lòng không thay đổi thông tin tài khoản (Password, Email)</li>
        </ul>

        <p className="font-bold mt-4 italic">❗ Hotline hỗ trợ: Gọi điện hoặc nhắn tin (Zalo)</p>
        <p className="flex items-center gap-2 mt-2"><Clock className="w-4 h-4 text-gray-500" /> Giờ làm việc: 24/7 - Luôn sẵn sàng đồng hành cùng bạn.</p>
      </div>
    </div>
  );
};

export default ProductDescription;
