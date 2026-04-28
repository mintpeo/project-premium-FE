import React from 'react';
import { Clock, PackageCheck, ShieldCheck } from 'lucide-react';

const ProductPolicy = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl p-5 flex items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <Clock className="text-[#22c55e] w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">Giao hàng</span>
          <span className="font-bold text-[#16a34a] text-[15px]">Qua email</span>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md transition">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <PackageCheck className="text-[#22c55e] w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">Thời gian giao hàng</span>
          <span className="font-bold text-[#16a34a] text-[15px]">12-24 tiếng</span>
        </div>
      </div>

      <div className="bg-[#f0f9ff] rounded-xl p-5 flex items-center gap-4 border border-blue-100 shadow-sm hover:shadow-md transition">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <ShieldCheck className="text-[#0284c7] w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-[12px] text-gray-500 font-medium uppercase tracking-wide mb-0.5">Bảo hành</span>
          <span className="font-bold text-[#0284c7] text-[15px]">30 ngày</span>
        </div>
      </div>
    </div>
  );
};

export default ProductPolicy;
