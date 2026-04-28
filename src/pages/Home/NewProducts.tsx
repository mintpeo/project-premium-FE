import React from 'react';
import { useNavigate } from 'react-router-dom';

const newProducts = [
  {
    id: 9,
    title: 'Gói Zoom Pro 1 Tháng (Tài khoản chính chủ)',
    category: 'LÀM VIỆC',
    sales: 124,
    price: '199,000đ',
    originalPrice: '350,000đ',
    discount: '-43%',
    image: 'https://picsum.photos/seed/zoom/200/200'
  },
  {
    id: 10,
    title: 'Netflix Premium 1 Tháng (Gia hạn)',
    category: 'GIẢI TRÍ',
    sales: 450,
    price: '65,000đ',
    originalPrice: null,
    discount: null,
    image: 'https://picsum.photos/seed/netflix/200/200'
  },
  {
    id: 11,
    title: 'Tài Khoản Grammarly Premium 1 Năm',
    category: 'HỌC TẬP',
    sales: 89,
    price: '349,000đ',
    originalPrice: '1,500,000đ',
    discount: '-76%',
    image: 'https://picsum.photos/seed/grammarly/200/200'
  },
  {
    id: 12,
    title: 'Youtube Premium Vĩnh Viễn Không Lỗi',
    category: 'GIẢI TRÍ',
    sales: 321,
    price: '399,000đ',
    originalPrice: null,
    discount: null,
    image: 'https://picsum.photos/seed/ytt/200/200'
  },
  {
    id: 13,
    title: 'Tài khoản ChatGPT Plus 1 tháng',
    category: 'AI',
    sales: 980,
    price: '450,000đ',
    originalPrice: null,
    discount: null,
    image: 'https://picsum.photos/seed/chatgpt/200/200'
  },
  {
    id: 14,
    title: 'Adobe Creative Cloud All App - 1 Năm',
    category: 'THIẾT KẾ',
    sales: 215,
    price: '850,000đ',
    originalPrice: null,
    discount: null,
    image: 'https://picsum.photos/seed/adobe/200/200'
  },
  {
    id: 15,
    title: 'Spotify Premium 12 Tháng Chính Chủ',
    category: 'NGHE NHẠC',
    sales: 420,
    price: '280,000đ',
    originalPrice: '590,000đ',
    discount: '-52%',
    image: 'https://picsum.photos/seed/spotify/200/200'
  },
  {
    id: 16,
    title: 'Key Office 365 / 2021 Tùy Chọn',
    category: 'LÀM VIỆC',
    sales: 310,
    price: '150,000đ',
    originalPrice: null,
    discount: null,
    image: 'https://picsum.photos/seed/office365/200/200'
  }
];

const NewProducts = () => {
  const navigate = useNavigate();
  return (
    <div className="relative pt-10 pb-16 bg-white border-t border-gray-100">
      <div className="relative z-10 mx-[10%]">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-10 text-[#0f172a]">
          SẢN PHẨM <span className="font-medium text-orange-500">MỚI NHẤT</span>
        </h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {newProducts.map((product) => (
            <div key={product.id} onClick={() => navigate('/product')} className="bg-white rounded-2xl p-2 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-shadow duration-300 relative group cursor-pointer border border-gray-100/50">
              
              {/* Product Image Box */}
              <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 relative">
                <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                {/* Discount Badge */}
                {product.discount && (
                  <div className="absolute top-1 left-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-sm">
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>
                    {product.discount}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 py-1 pr-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-[#0f172a] text-sm font-bold leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  {/* Category and Sales */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-gray-100 text-gray-500 text-[9px] font-semibold px-2 py-0.5 rounded border border-gray-200 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <div className="flex items-center text-gray-400 text-[10px] ml-auto font-medium">
                      <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                      {product.sales}
                    </div>
                  </div>
                </div>

                {/* Price and Cart Button */}
                <div className="flex items-end justify-between mt-auto">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-gray-400 text-[11px] line-through decoration-gray-300 font-medium">
                        {product.originalPrice}
                      </span>
                    )}
                    <span className="text-[#0f172a] font-black text-[15px] leading-none">
                      {product.price}
                    </span>
                  </div>
                  
                  {/* Neon Cart Button */}
                  <button onClick={(e) => e.stopPropagation()} className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_12px_rgba(74,222,128,0.7)] hover:shadow-[0_0_15px_rgba(74,222,128,1)] hover:scale-110 transition-all duration-300 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
