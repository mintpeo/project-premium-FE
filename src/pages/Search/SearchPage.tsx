import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';
import useAddToCart from '../../hooks/useAddToCart';

interface Product {
  id: number;
  img: string;
  rating: number;
  sold: number;
  name: string;
  priceOri: number;
  price: number;
  categories: string[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
}

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, addedId } = useAddToCart();

  const keyword = searchParams.get('keyword') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sortBy = searchParams.get('sortBy') || 'sold';
  const sortDir = searchParams.get('sortDir') || 'desc';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(keyword);

  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  useEffect(() => {
    fetch('http://localhost:8080/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(console.error);
  }, []);

  const doSearch = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (categoryId) params.set('categoryId', categoryId);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('sortBy', sortBy);
      params.set('sortDir', sortDir);

      const res = await fetch(`http://localhost:8080/api/product/search?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  }, [keyword, categoryId, minPrice, maxPrice, sortBy, sortDir]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('keyword', searchInput);
  };

  const calcDiscount = (priceOri: number, price: number) =>
    Math.trunc(((priceOri - price) / priceOri) * 100);

  return (
    <div className="min-h-screen bg-[#F0F4FF] font-sans flex flex-col">
      <Header />
      <main className="flex-1 mx-[10%] py-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-orange-500 transition">Trang chủ</button>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Tìm kiếm</span>
          {keyword && (
            <>
              <span>/</span>
              <span className="text-orange-500 font-semibold">"{keyword}"</span>
            </>
          )}
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3 max-w-2xl">
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 focus:outline-none focus:border-blue-400 shadow-sm"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition"
            >
              Tìm kiếm
            </button>
          </div>
        </form>

        <div className="flex gap-6">
          <div className="w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sticky top-28">
              <h3 className="font-bold text-gray-800 mb-4">Bộ lọc</h3>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Danh mục</label>
                <select
                  value={categoryId}
                  onChange={e => updateParam('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="">Tất cả</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Giá tối thiểu</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => updateParam('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Giá tối đa</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => updateParam('maxPrice', e.target.value)}
                  placeholder="10000000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="mb-5">
                <label className="text-sm font-medium text-gray-600 mb-2 block">Sắp xếp theo</label>
                <select
                  value={`${sortBy}-${sortDir}`}
                  onChange={e => {
                    const [s, d] = e.target.value.split('-');
                    const params = new URLSearchParams(searchParams);
                    params.set('sortBy', s);
                    params.set('sortDir', d);
                    setSearchParams(params);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-blue-400"
                >
                  <option value="sold-desc">Bán chạy nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="rating-desc">Đánh giá cao nhất</option>
                  <option value="id-desc">Mới nhất</option>
                </select>
              </div>

              <button
                onClick={() => setSearchParams(new URLSearchParams())}
                className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
              >
                Xoá bộ lọc
              </button>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-medium">Không tìm thấy sản phẩm nào</p>
                <p className="text-sm mt-1">Thử thay đổi từ khoá hoặc bộ lọc</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">Tìm thấy {products.length} sản phẩm</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="bg-white rounded-2xl p-2 flex gap-3 shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_5px_15px_rgba(0,0,0,0.08)] transition-shadow duration-300 relative group cursor-pointer border border-gray-100/50"
                    >
                      <div className="w-[110px] h-[110px] rounded-xl overflow-hidden flex-shrink-0 relative">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { const el = e.target as HTMLImageElement; el.src = 'https://placehold.co/110x110/' + ['e85a21','3b82f6','22c55e','a855f7','ec4899','f59e0b','06b6d4','ef4444'][product.name.length%8] + '/white?text=' + encodeURIComponent(product.name.substring(0,20)); }}
                        />
                        {calcDiscount(product.priceOri, product.price) > 0 && (
                          <div className="absolute top-1 left-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                            -{calcDiscount(product.priceOri, product.price)}%
                          </div>
                        )}
                      </div>

                      <div className="flex-1 py-1 pr-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-[#0f172a] text-sm font-bold leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                            {'★'.repeat(Math.round(product.rating))}
                            <span className="text-gray-400 ml-1">({product.sold?.toLocaleString()})</span>
                          </div>
                          {product.categories?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              {product.categories.map((cat, i) => (
                                <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">{cat}</span>
                              ))}
                            </div>
                          )}
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
                            onClick={(e) => addToCart(product.id, e)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all duration-300 flex-shrink-0 hover:scale-110 ${
                              addedId === product.id
                                ? 'bg-green-600 shadow-[0_0_12px_rgba(22,163,74,0.8)]'
                                : 'bg-gradient-to-br from-green-400 to-green-500 shadow-[0_0_12px_rgba(74,222,128,0.7)] hover:shadow-[0_0_15px_rgba(74,222,128,1)]'
                            }`}
                          >
                            {addedId === product.id ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default SearchPage;
