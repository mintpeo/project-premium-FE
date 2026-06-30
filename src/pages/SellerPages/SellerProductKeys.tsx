import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProductRef {
  id: number;
  name: string;
  img: string;
}

interface ProductKey {
  id: number;
  product: ProductRef;
  keyCode: string;
  sold: boolean;
  orderItem: any;
  createdAt: string;
}

const SellerProductKeys = () => {
  const { user } = useAuth();
  const [keys, setKeys] = useState<ProductKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [form, setForm] = useState({ productId: '', keyCode: '' });
  const [bulkForm, setBulkForm] = useState({ productId: '', keyCodes: '' });
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ totalKeys: 0, soldKeys: 0, availableKeys: 0 });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold'>('all');

  useEffect(() => {
    if (user) {
      fetchKeys();
      fetchProducts();
      fetchStats();
    }
  }, [user]);

  const fetchKeys = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/product-keys/${user.id}`);
      if (res.ok) setKeys(await res.json());
    } catch {
      setKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/api/seller/product-keys/stats/${user.id}`);
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const fetchProducts = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/api/seller/products/${user.id}`);
      if (res.ok) setProducts(await res.json());
    } catch {}
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.productId || !form.keyCode.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('http://localhost:8080/api/seller/product-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(form.productId),
          keyCode: form.keyCode.trim(),
          sellerId: user.id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Thêm thất bại');
      }
      setModalOpen(false);
      setForm({ productId: '', keyCode: '' });
      await fetchKeys();
      await fetchStats();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bulkForm.productId || !bulkForm.keyCodes.trim()) return;
    setSaving(true);
    try {
      const codes = bulkForm.keyCodes.split('\n').map(s => s.trim()).filter(Boolean);
      const res = await fetch('http://localhost:8080/api/seller/product-keys/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(bulkForm.productId),
          keyCodes: codes,
          sellerId: user.id,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Thêm hàng loạt thất bại');
      }
      setBulkModalOpen(false);
      setBulkForm({ productId: '', keyCodes: '' });
      await fetchKeys();
      await fetchStats();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || ''));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!user) return;
    if (!window.confirm('Bạn chắc chắn muốn xoá key này khỏi kho?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/seller/product-keys/${id}/seller/${user.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Xoá thất bại');
      }
      await fetchKeys();
      await fetchStats();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || ''));
    }
  };

  // Filter and search keys
  const filteredKeys = keys.filter(k => {
    const matchesSearch =
      (k.product?.name || '').toLowerCase().includes(searchText.toLowerCase()) ||
      (k.keyCode || '').toLowerCase().includes(searchText.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'available' && !k.sold) ||
      (statusFilter === 'sold' && k.sold);

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý kho Key</h1>
        </div>
        <div className="admin-card">
          <div className="admin-loading">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="admin-loading-row">
                <div className="admin-skeleton h-4 w-56" />
                <div className="admin-skeleton h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý kho Key</h1>
          <span className="admin-page-count">{filteredKeys.length} keys</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setModalOpen(true)} className="admin-btn-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm key
          </button>
          <button onClick={() => setBulkModalOpen(true)} className="admin-btn-secondary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            Thêm hàng loạt
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="admin-card">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-400 uppercase font-medium">Tổng keys trong kho</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalKeys}</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-400 uppercase font-medium">Đã bán</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.soldKeys}</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-4 text-center">
            <p className="text-xs text-gray-400 uppercase font-medium">Còn lại (Sẵn sàng)</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.availableKeys}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 w-full sm:max-w-xs">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm sản phẩm, key code..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'available', 'sold'] as const).map(status => {
            const label = status === 'all' ? 'Tất cả' : status === 'available' ? 'Còn hàng' : 'Đã bán';
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keys Table */}
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Key Code</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Ngày tạo</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map(k => (
                <tr key={k.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <img
                        src={k.product?.img || '/assets/netflix-logo.png'}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]" title={k.product?.name}>
                        {k.product?.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded border border-gray-100 select-all">
                      {k.keyCode}
                    </span>
                  </td>
                  <td className="text-center">
                    {k.sold ? (
                      <span className="admin-badge-default">
                        <span className="admin-badge-dot" />
                        Đã bán
                      </span>
                    ) : (
                      <span className="admin-badge-success">
                        <span className="admin-badge-dot" />
                        Còn hàng
                      </span>
                    )}
                  </td>
                  <td className="text-center text-xs text-gray-400">
                    {new Date(k.createdAt).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="text-right">
                    {!k.sold && (
                      <button
                        onClick={() => handleDelete(k.id)}
                        className="admin-btn-icon-sm text-gray-400 hover:text-red-600 hover:bg-red-50"
                        title="Xoá Key"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredKeys.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="admin-empty">
                      <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <p className="admin-empty-title">Không tìm thấy key nào</p>
                      <p className="admin-empty-desc">
                        {searchText || statusFilter !== 'all' ? 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm' : 'Kho key của bạn hiện đang trống'}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Single Key Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal max-w-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Thêm Key</h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sản phẩm của bạn</label>
                  <select
                    value={form.productId}
                    onChange={e => setForm({ ...form, productId: e.target.value })}
                    required
                    className="admin-select"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Key Code</label>
                  <input
                    type="text"
                    value={form.keyCode}
                    onChange={e => setForm({ ...form, keyCode: e.target.value })}
                    required
                    className="admin-input font-mono"
                    placeholder="VD: XXXX-XXXX-XXXX"
                  />
                </div>
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button type="submit" disabled={saving} className="admin-btn-primary">
                    {saving ? 'Đang lưu...' : 'Thêm'}
                  </button>
                  <button type="button" onClick={() => setModalOpen(false)} className="admin-btn-ghost">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Bulk Keys Modal */}
      {bulkModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Thêm Key hàng loạt</h3>
                <button
                  onClick={() => setBulkModalOpen(false)}
                  className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleBulkAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sản phẩm của bạn</label>
                  <select
                    value={bulkForm.productId}
                    onChange={e => setBulkForm({ ...bulkForm, productId: e.target.value })}
                    required
                    className="admin-select"
                  >
                    <option value="">Chọn sản phẩm</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Danh sách Key (mỗi dòng 1 key)
                  </label>
                  <textarea
                    value={bulkForm.keyCodes}
                    onChange={e => setBulkForm({ ...bulkForm, keyCodes: e.target.value })}
                    required
                    rows={8}
                    className="admin-input font-mono text-xs"
                    placeholder="XXXX-XXXX-XXXX&#10;YYYY-YYYY-YYYY&#10;ZZZZ-ZZZZ-ZZZZ"
                  />
                </div>
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button type="submit" disabled={saving} className="admin-btn-primary">
                    {saving ? 'Đang lưu...' : 'Thêm tất cả'}
                  </button>
                  <button type="button" onClick={() => setBulkModalOpen(false)} className="admin-btn-ghost">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProductKeys;
