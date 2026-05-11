import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';

interface Product {
  id: number;
  img: string;
  rating: number;
  sold: number;
  name: string;
  priceOri: number;
  price: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  netflix: 'Netflix',
  adobe: 'Adobe',
  google: 'Google',
  microsoft: 'Microsoft',
  spotify: 'Spotify',
  canva: 'Canva',
  ai: 'AI',
  'bao-mat': 'Bảo Mật',
  games: 'Games',
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/api/category/${category}`);
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error('Error fetching category products:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  const calcDiscount = (priceOri: number, price: number) =>
    Math.trunc(((priceOri - price) / priceOri) * 100);

  const label = CATEGORY_LABELS[category || ''] || category;

  return (
    <div className="min-h-screen bg-[#F0F4FF] font-sans flex flex-col">
      <Header />

      <main className="flex-1 mx-[10%] py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">Trang chủ</button>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{label}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-[#0f172a] mb-8">
          Sản phẩm <span className="text-orange-500">{label}</span>
        </h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 h-32 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-24 h-24 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3 mt-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-lg font-medium">Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${category}/${product.id}`)}
                className="bg-white rounded-2xl p-2 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-shadow duration-300 relative group cursor-pointer border border-gray-100/50"
              >
                {/* Image */}
                <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 relative">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/products/youtube-premium.png'; }}
                  />
                  {calcDiscount(product.priceOri, product.price) > 0 && (
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      -{calcDiscount(product.priceOri, product.price)}%
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 py-1 pr-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[#0f172a] text-sm font-bold leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                      {'★'.repeat(Math.round(product.rating))}
                      <span className="text-gray-400 ml-1">({product.sold?.toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-[11px] line-through font-medium">
                        {product.priceOri?.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-[#0f172a] font-black text-[15px] leading-none">
                        {product.price?.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_12px_rgba(74,222,128,0.7)] hover:shadow-[0_0_15px_rgba(74,222,128,1)] hover:scale-110 transition-all duration-300 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default CategoryPage;
