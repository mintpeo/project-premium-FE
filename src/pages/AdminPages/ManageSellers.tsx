import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';

interface Seller {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  sellerVerified: boolean;
  createdAt: string;
  productCount: number;
}

const ManageSellers = () => {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [productModal, setProductModal] = useState<{ open: boolean; seller: Seller | null; products: any[]; loading: boolean }>({
    open: false, seller: null, products: [], loading: false,
  });

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/sellers');
      if (!res.ok) throw new Error('Không thể tải danh sách');
      setSellers(await res.json());
    } catch {
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/sellers/${id}/verify`, { method: 'PUT' });
      if (!res.ok) throw new Error('Xác thực thất bại');
      await fetchSellers();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xác thực'));
    }
  };

  const handleBan = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn cấm người bán này?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/sellers/${id}/ban`, { method: 'PUT' });
      if (!res.ok) throw new Error('Cấm thất bại');
      await fetchSellers();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cấm'));
    }
  };

  const viewProducts = async (seller: Seller) => {
    setProductModal({ open: true, seller, products: [], loading: true });
    try {
      const res = await fetch(`http://localhost:8080/api/seller/products/${seller.id}`);
      const data = res.ok ? await res.json() : [];
      setProductModal(prev => ({ ...prev, products: Array.isArray(data) ? data : [], loading: false }));
    } catch {
      setProductModal(prev => ({ ...prev, loading: false }));
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người bán</h1>
        </div>
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card p-5">
              <div className="flex items-center gap-4">
                <div className="admin-skeleton w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="admin-skeleton h-4 w-48" />
                  <div className="admin-skeleton h-3 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý người bán</h1>
          <span className="admin-page-count">{sellers.length} người bán</span>
        </div>
      </div>

      {sellers.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="admin-empty-title">Chưa có người bán nào</p>
            <p className="admin-empty-desc">Người dùng đăng ký làm seller sẽ xuất hiện ở đây</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {sellers.map(seller => (
            <div key={seller.id} className="admin-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm ${seller.sellerVerified ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-amber-500 to-orange-600'}`}>
                    {getInitials(seller.fullName)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{seller.fullName}</p>
                    <p className="text-xs text-gray-400">{seller.email} · {seller.phoneNumber}</p>
                    <p className="text-xs text-gray-400">{seller.productCount} sản phẩm · Đã tham gia {new Date(seller.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => viewProducts(seller)}
                    className="admin-btn-icon-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Xem sản phẩm">
                    <Eye size={16} />
                  </button>
                  <span className={seller.sellerVerified ? 'admin-badge-success' : 'admin-badge-error'}>
                    <span className="admin-badge-dot" />
                    {seller.sellerVerified ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                  {seller.sellerVerified ? (
                    <button onClick={() => handleBan(seller.id)}
                      className="admin-btn-icon-sm text-gray-400 hover:text-red-600 hover:bg-red-50" title="Cấm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  ) : (
                    <button onClick={() => handleVerify(seller.id)}
                      className="admin-btn-icon-sm text-gray-400 hover:text-emerald-600 hover:bg-emerald-50" title="Duyệt">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {productModal.open && (
        <div className="admin-modal-overlay" onClick={() => setProductModal(prev => ({ ...prev, open: false }))}>
          <div className="admin-modal max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">
                    Sản phẩm của: {productModal.seller?.fullName}
                  </h3>
                </div>
                <button onClick={() => setProductModal(prev => ({ ...prev, open: false }))}
                  className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {productModal.loading ? (
                <div className="space-y-3 py-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="admin-skeleton w-10 h-10 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="admin-skeleton h-4 w-48" />
                        <div className="admin-skeleton h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : productModal.products.length === 0 ? (
                <div className="admin-empty py-10">
                  <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="admin-empty-title">Chưa có sản phẩm</p>
                  <p className="admin-empty-desc">Người bán này chưa đăng sản phẩm nào</p>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto -mx-2 px-2 space-y-2">
                  {productModal.products.map((prod: any) => (
                    <div key={prod.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <img src={prod.img || '/assets/placeholder.png'} alt={prod.name}
                        className="w-11 h-11 rounded-xl object-cover shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{prod.name}</p>
                        <p className="text-xs text-gray-400">ID: {prod.id}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {prod.price?.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSellers;
