import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ShoppingCart, ShieldCheck, Star, PackageCheck } from 'lucide-react';
import './ProductBanner.css'

const ProductBanner = ({product}) => {
  const navigate = useNavigate();
  const [imgFailed, setImgFailed] = useState(false);
  const userData = localStorage.getItem("auth_user");
  const user = JSON.parse(userData);

  const [activeTypesIndex, setActiveTypesIndex] = useState(0);
  const [activeDuraIndex, setActiveDurasIndex] = useState(0);

  const [typesText, setTypesText] = useState("");
  const [duraText, setDuraText] = useState("");

  console.log(product);

  // Add To Cart
  const addToCart = async () => {
    const finalType = typesText || product.typesUser[0]; // ko co typesText thi product.typesUser[0]
    const finalDura = duraText || product.duration[0];

    const body = {
      "userId": user.id,
      "productId": product.id,
      "quantity": 1,
      "duration": finalDura,
      "typeUser": finalType
    }

    try {
      const res = await fetch(`http://localhost:8080/api/cart/addToCart`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (res.ok) window.location.reload();
    } catch (e) {
      console.log("Error: Add To Cart", e);
    }
  }

  if (!product) {
    return <div>Đang tải dữ liệu sản phẩm...</div>;
  }

  return (
    <div className="relative w-full bg-[#1e293b] pt-6 pb-20 overflow-hidden">
      {/* Blurred Background Image */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/chatgpt/1920/1080')] bg-cover bg-center blur-[30px] opacity-20"></div>

      <div className="max-w-[1200px] mx-auto px-4 relative z-10 text-white">
        {/* Breadcrumb */}
        <div className="text-[13px] text-gray-300 mb-6 flex items-center gap-1 font-medium">
          <span className="hover:text-white cursor-pointer transition">Trang chủ</span>
          <span className="opacity-50">/</span>
          <span className="hover:text-white cursor-pointer transition">{product.categories}</span>
          <span className="opacity-50">/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[340px_200px_1fr] gap-x-12 gap-y-8">
          {/* Column 1: Image */}
          <div className="w-full bg-[#cc55ff] rounded-2xl aspect-square flex items-center justify-center p-3 shadow-2xl overflow-hidden relative group">
            {imgFailed ? (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-white font-bold text-xl text-center p-4 select-none"
                style={{ backgroundColor: ['#e85a21','#3b82f6','#22c55e','#a855f7','#ec4899','#f59e0b','#06b6d4','#ef4444'][(product.name||'').length % 8] }}
              >
                {product.name || 'Sản phẩm'}
              </div>
            ) : (
              <img src={product.img || '/assets/placeholder.png'} className="w-full h-full object-cover rounded-xl shadow-inner group-hover:scale-105 transition duration-500" alt={product.name || ''} onError={() => setImgFailed(true)} />
            )}
          </div>

          {/* Column 2: Stats */}
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center shadow-inner">
                <MessageCircle size={18} className="text-gray-200" />
              </div>
              <span className="text-[14px] font-medium text-gray-100">{product.rating} Đánh giá từ khách hàng</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center shadow-inner">
                <ShoppingCart size={18} className="text-gray-200" />
              </div>
              <span className="text-[14px] font-medium text-gray-100">{product.sold} Đã bán</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center shadow-inner">
                <ShieldCheck size={18} className="text-[#34d399]" />
              </div>
              <span className="text-[14px] font-bold text-[#34d399] tracking-wide">Chính sách bảo hành</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[38px] h-[38px] rounded-full bg-white/10 flex items-center justify-center shadow-inner">
                <Star size={18} className="text-[#fbbf24] fill-[#fbbf24]" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] text-gray-400 font-medium">Rating</span>
                <div className="flex text-[#fbbf24] text-[15px] tracking-widest leading-none mt-0.5">
                  ★★★★★
                  <span className="text-white ml-2 font-bold tracking-normal text-[14px]">{product.rating.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Title, Price, Buy */}
          <div className="flex flex-col">
            <h1 className="text-[26px] md:text-[32px] font-bold mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-gray-400 line-through text-[16px] font-medium">{product.priceOri.toLocaleString()}đ</span>
              <span className="text-[34px] font-black text-white">{product.price.toLocaleString()}đ</span>
            </div>

            {/* TYPES USER */}
            {
              product.typesUser && product.typesUser.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-[14px] font-medium mb-3 text-gray-300">GÓI ĐĂNG KÝ</p>
                    <div className="flex flex-wrap gap-3">
                      <ul className="list-item">
                        {
                          product.typesUser.map((types, index) => (
                              <li className="item" key={index}>
                                <button className={`px-5 py-2.5 ${activeTypesIndex === index ? "active" : ""}`}
                                onClick={() => {
                                  setActiveTypesIndex(index);
                                  setTypesText(types);
                                }}>{types}</button>
                              </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
              ) : (<></>)
            }

            {/* DURATION */}
            {
              product.duration && product.duration.length > 0 ? (
                  <div className="mb-6">
                    <p className="text-[14px] font-medium mb-3 text-gray-300">THỜI HẠN</p>
                    <div className="flex flex-wrap gap-3">
                      <ul className="list-item">
                        {
                          product.duration.map((dura, index) => (
                              <li className="item">
                                <button className={`px-5 py-2.5 ${activeDuraIndex === index ? "active" : ""}`}
                                onClick={() => {
                                  setActiveDurasIndex(index);
                                  setDuraText(dura);
                                }}>{dura}</button>
                              </li>
                          ))
                        }
                      </ul>
                    </div>
                  </div>
              ) : (<></>)
            }

            <div className="flex flex-col sm:flex-row gap-4 mb-6 mt-2">
              <button
                onClick={() => navigate('/checkout', { state: { product, type: 'main' } })}
                className="flex-1 bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold py-3.5 px-6 rounded-md shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 transition uppercase tracking-wide text-[15px]">
                <PackageCheck size={20} />
                Mua Ngay
              </button>
              <button className="flex-1 bg-[#ea580c] hover:bg-[#c2410b] text-white font-bold py-3.5 px-6 rounded-md shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition uppercase tracking-wide text-[15px]"
              onClick={() => addToCart()}>
                <ShoppingCart size={20} />
                Thêm vào giỏ
              </button>
            </div>

            <div className="p-4 bg-white/5 rounded-md border border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner">
              <p className="text-[13px] text-gray-300 font-medium whitespace-nowrap">Link giới thiệu để nhận hoa hồng 10%/đơn:</p>
              <div className="flex gap-2 w-full md:w-auto flex-1 md:max-w-[400px]">
                <input
                  type="text"
                  defaultValue="https://premiumkey.com/ref/1234567890"
                  readOnly
                  className="flex-1 bg-black/40 border border-white/20 rounded px-3 py-2 text-[13px] text-gray-300 focus:outline-none"
                />
                <button className="px-4 bg-[#3b82f6] hover:bg-[#2563eb] rounded text-sm font-bold transition shadow">Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
