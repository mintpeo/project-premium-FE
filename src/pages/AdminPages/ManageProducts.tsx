import React, { useState, useEffect, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  img: string;
  price: number;
  priceOri: number;
  rating: number;
  sold: number;
  approved: boolean;
  seller?: { id: number; email: string; fullName: string } | null;
  productCates?: { id: number; category: { id: number; name: string } }[];
}

interface Category {
  id: number;
  name: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', img: '', price: '', priceOri: '' });
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'platform' | 'seller' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories()]);
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/categories');
      if (res.ok) setCategories(await res.json());
    } catch {}
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/product/all');
      if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
      setProducts(await res.json());
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('http://localhost:8080/api/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload thất bại');
      const data = await res.json();
      setForm(prev => ({ ...prev, img: data.url }));
    } catch (err: any) {
      alert('Lỗi upload: ' + (err.message || 'Không thể upload ảnh'));
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', img: '', price: '', priceOri: '' });
    setSelectedCategoryIds([]);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      img: product.img || '',
      price: String(product.price || ''),
      priceOri: String(product.priceOri || ''),
    });
    setSelectedCategoryIds(product.productCates?.map(pc => pc.category.id) || []);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const body: any = {
        name: form.name,
        img: form.img,
        price: form.price ? Number(form.price) : null,
        priceOri: form.priceOri ? Number(form.priceOri) : null,
        categoryIds: selectedCategoryIds,
      };
      const url = editing
        ? `http://localhost:8080/api/admin/products/${editing.id}`
        : 'http://localhost:8080/api/admin/products';
      const res = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Lỗi khi lưu sản phẩm');
      setModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể lưu'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoá thất bại');
      await fetchProducts();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xoá'));
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/products/${id}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error('Duyệt thất bại');
      await fetchProducts();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể duyệt'));
    }
  };

  const filtered = products
    .filter(p => filter === 'all' ? true : filter === 'platform' ? !p.seller : filter === 'seller' ? p.seller : !p.approved)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        </div>
        <div className="admin-card">
          <div className="admin-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="admin-loading-row">
                <div className="admin-skeleton w-10 h-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="admin-skeleton h-4 w-56" />
                  <div className="admin-skeleton h-3 w-36" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý sản phẩm</h1>
          <span className="admin-page-count">{products.length} sản phẩm</span>
        </div>
        <div className="flex items-center gap-2">
        <a href="http://localhost:8080/api/admin/export/products"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Xuất Excel
        </a>
        <button onClick={openCreate} className="admin-btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-3.5">
        <div className="flex items-center gap-2">
          {(['all', 'platform', 'seller', 'pending'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={filter === f ? 'admin-filter-active' : 'admin-filter-inactive'}>
              {f === 'all' ? 'Tất cả' : f === 'platform' ? 'Sản phẩm sàn' : f === 'seller' ? 'Sản phẩm seller' : 'Chờ duyệt'}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 max-w-xs w-full">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th className="text-right">Giá gốc</th>
                <th className="text-right">Giá bán</th>
                <th className="text-center">Đánh giá</th>
                <th className="text-center">Đã bán</th>
                <th className="text-center">Loại</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.img || '/assets/netflix-logo.png'}
                        alt={product.name}
                        className="w-10 h-10 rounded-xl object-cover shadow-sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-right text-gray-400 line-through text-xs">
                    {product.priceOri?.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="text-right font-semibold text-gray-900">
                    {product.price?.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="text-center">
                    <span className="admin-tag">
                      ★ {product.rating || 0}
                    </span>
                  </td>
                  <td className="text-center text-sm font-medium">{product.sold || 0}</td>
                  <td className="text-center">
                    {!product.approved ? (
                      <span className="admin-badge-error"><span className="admin-badge-dot" />Chờ duyệt</span>
                    ) : product.seller ? (
                      <span className="admin-badge-warning"><span className="admin-badge-dot" />Seller</span>
                    ) : (
                      <span className="admin-badge-info"><span className="admin-badge-dot" />Sàn</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!product.approved && (
                        <button onClick={() => handleApprove(product.id)}
                          className="admin-btn-icon-sm text-green-600 hover:bg-green-50" title="Duyệt sản phẩm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button onClick={() => openEdit(product)} className="admin-btn-icon text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="admin-btn-icon text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty">
                      <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="admin-empty-title">Không tìm thấy sản phẩm</p>
                      <p className="admin-empty-desc">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal max-w-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
                </h3>
                <button onClick={() => setModalOpen(false)} className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên sản phẩm</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                    className="admin-input" placeholder="VD: Netflix Premium 1 Tháng" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá bán (VNĐ)</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                      className="admin-input" placeholder="100000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá gốc (VNĐ)</label>
                    <input type="number" value={form.priceOri} onChange={e => setForm({ ...form, priceOri: e.target.value })}
                      className="admin-input" placeholder="150000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hình ảnh</label>
                  <div className="flex gap-2">
                    <input type="text" value={form.img} onChange={e => setForm({ ...form, img: e.target.value })}
                      className="admin-input flex-1" placeholder="URL hình ảnh" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                      className="admin-btn-secondary whitespace-nowrap">
                      {uploading ? <span className="loading loading-spinner loading-xs" /> : 'Chọn file'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </div>
                  {form.img && (
                    <img src={form.img} alt="preview" className="mt-3 w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm" />
                  )}
                </div>
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2.5 border border-gray-200 rounded-xl bg-gray-50/50">
                      {categories.map(cat => (
                        <span key={cat.id}
                          className={selectedCategoryIds.includes(cat.id) ? 'admin-chip-checked' : 'admin-chip-unchecked'}
                          onClick={() => {
                            if (selectedCategoryIds.includes(cat.id)) {
                              setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat.id));
                            } else {
                              setSelectedCategoryIds([...selectedCategoryIds, cat.id]);
                            }
                          }}>
                          <span className={`w-2 h-2 rounded-full ${selectedCategoryIds.includes(cat.id) ? 'bg-blue-500' : 'bg-gray-300'}`} />
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
    </div>
  );
};

export default ManageProducts;