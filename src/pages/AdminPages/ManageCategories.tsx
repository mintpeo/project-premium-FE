import React, { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}

interface CategoryProduct {
  id: number;
  name: string;
  img: string;
  price: number;
}

const FA_ICONS = [
  { label: 'Phim', icon: 'fa-solid fa-film' },
  { label: 'Nhạc', icon: 'fa-solid fa-music' },
  { label: 'Office', icon: 'fa-solid fa-file-word' },
  { label: 'Adobe', icon: 'fa-brands fa-adobe' },
  { label: 'Cloud', icon: 'fa-solid fa-cloud' },
  { label: 'Thiết kế', icon: 'fa-solid fa-palette' },
  { label: 'ChatGPT', icon: 'fa-solid fa-robot' },
  { label: 'VPN', icon: 'fa-solid fa-shield-halved' },
  { label: 'Game', icon: 'fa-solid fa-gamepad' },
  { label: 'Video', icon: 'fa-solid fa-video' },
  { label: 'Email', icon: 'fa-solid fa-envelope' },
  { label: 'Lưu trữ', icon: 'fa-solid fa-database' },
  { label: 'Học tập', icon: 'fa-solid fa-graduation-cap' },
  { label: 'Bảo mật', icon: 'fa-solid fa-lock' },
  { label: 'Mạng', icon: 'fa-solid fa-wifi' },
  { label: 'Wallet', icon: 'fa-solid fa-wallet' },
];

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', icon: '' });
  const [saving, setSaving] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [productModal, setProductModal] = useState<{ open: boolean; category: Category | null; products: CategoryProduct[]; loading: boolean }>({
    open: false,
    category: null,
    products: [],
    loading: false,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/categories');
      if (!res.ok) throw new Error('Không thể tải danh mục');
      setCategories(await res.json());
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', icon: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const url = editing
        ? `http://localhost:8080/api/admin/categories/${editing.id}`
        : 'http://localhost:8080/api/admin/categories';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Lỗi khi lưu danh mục');
      setModalOpen(false);
      await fetchCategories();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể lưu'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá danh mục này?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoá thất bại');
      await fetchCategories();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xoá'));
    }
  };

  const handleToggle = async (cat: Category) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/categories/${cat.id}/toggle`, { method: 'PUT' });
      if (!res.ok) throw new Error('Lỗi khi cập nhật trạng thái');
      await fetchCategories();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật'));
    }
  };

  const viewProducts = async (cat: Category) => {
    setProductModal({ open: true, category: cat, products: [], loading: true });
    try {
      const res = await fetch(`http://localhost:8080/api/product/category/${cat.id}`);
      if (!res.ok) throw new Error('Không thể tải sản phẩm');
      const data = await res.json();
      setProductModal(prev => ({ ...prev, products: Array.isArray(data) ? data : [], loading: false }));
    } catch {
      setProductModal(prev => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="admin-card">
              <div className="p-6 flex flex-col items-center gap-3">
                <div className="admin-skeleton w-14 h-14 rounded-xl" />
                <div className="admin-skeleton h-4 w-24" />
                <div className="admin-skeleton h-5 w-16 rounded-full" />
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
          <h1>Quản lý danh mục</h1>
          <span className="admin-page-count">{categories.length} danh mục</span>
        </div>
        <button onClick={openCreate} className="admin-btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="admin-empty-title">Chưa có danh mục nào</p>
            <p className="admin-empty-desc">Thêm danh mục đầu tiên để bắt đầu</p>
            <button onClick={openCreate} className="admin-btn-primary">+ Thêm danh mục</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className={`admin-card group hover:shadow-md transition-all duration-300 cursor-pointer ${!cat.active ? 'opacity-60' : ''}`}
              onClick={() => viewProducts(cat)}>
              <div className="p-6 flex flex-col items-center text-center relative">
                <div className="relative mb-3">
                  {cat.icon ? (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-sm">
                      <i className={`${cat.icon} text-2xl text-white`} />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                <span className={cat.active ? 'admin-badge-success mt-2' : 'admin-badge-error mt-2'}>
                  <span className="admin-badge-dot" />
                  {cat.active ? 'Hoạt động' : 'Ẩn'}
                </span>
                <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(cat)} className="admin-btn-icon-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50" title="Sửa">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleToggle(cat)}
                    className={`admin-btn-icon-sm ${cat.active ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`} title={cat.active ? 'Ẩn' : 'Hiện'}>
                    {cat.active ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="admin-btn-icon-sm text-gray-400 hover:text-red-600 hover:bg-red-50" title="Xoá">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 text-[11px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Nhấp để xem sản phẩm
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editing ? 'Sửa danh mục' : 'Thêm danh mục'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên danh mục</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="admin-input" placeholder="VD: Netflix, Spotify..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (Font Awesome)</label>
                  <div className="relative">
                    <input type="text" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                      className="admin-input w-full" placeholder="VD: fa-solid fa-film"
                      onFocus={() => setShowIconPicker(true)} />
                    {form.icon && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <i className={`${form.icon} text-sm text-white`} />
                      </div>
                    )}
                  </div>
                  {showIconPicker && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500">Chọn icon nhanh</span>
                        <button onClick={() => setShowIconPicker(false)} className="text-xs text-gray-400 hover:text-gray-600">Đóng</button>
                      </div>
                      <div className="grid grid-cols-8 gap-2">
                        {FA_ICONS.map(fa => (
                          <button key={fa.icon} type="button" onClick={() => { setForm({ ...form, icon: fa.icon }); setShowIconPicker(false); }}
                            className={`p-2 rounded-lg flex flex-col items-center gap-1 transition-all ${form.icon === fa.icon ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-white hover:shadow-sm'}`}
                            title={fa.label}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <i className={`${fa.icon} text-sm text-white`} />
                            </div>
                            <span className="text-[10px] text-gray-500">{fa.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button type="submit" disabled={saving || uploading} className="admin-btn-primary">
                    {saving ? <><span className="loading loading-spinner loading-xs" /> Đang lưu...</> : editing ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="admin-btn-ghost">Hủy</button>
                </div>
              </form>
            </div>
          </div>
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
                    Sản phẩm trong danh mục: {productModal.category?.name}
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
                  <p className="admin-empty-desc">Danh mục này chưa có sản phẩm nào</p>
                </div>
              ) : (
                <div className="max-h-[420px] overflow-y-auto -mx-2 px-2 space-y-2">
                  {productModal.products.map(prod => (
                    <div key={prod.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                      <img src={prod.img || '/assets/netflix-logo.png'} alt={prod.name}
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

export default ManageCategories;