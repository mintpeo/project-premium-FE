import React, { useState, useEffect } from 'react';

interface Coupon {
  id: number;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxUses: number | null;
  usedCount: number;
  expiryDate: string | null;
  active: boolean;
  createdAt: string;
}

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({
    code: '', discountType: 'PERCENT', discountValue: '',
    minOrderValue: '', maxUses: '', expiryDate: ''
  });
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/coupons');
      if (res.ok) setCoupons(await res.json());
    } catch { setCoupons([]); }
    finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', discountType: 'PERCENT', discountValue: '', minOrderValue: '', maxUses: '', expiryDate: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code, discountType: c.discountType, discountValue: String(c.discountValue),
      minOrderValue: c.minOrderValue ? String(c.minOrderValue) : '',
      maxUses: c.maxUses ? String(c.maxUses) : '',
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 10) : ''
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code.trim() || !form.discountValue) return;
    setSaving(true);
    try {
      const body: any = {
        code: form.code, discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiryDate: form.expiryDate ? form.expiryDate + 'T23:59:00' : null
      };
      if (editing) {
        body.active = editing.active;
        await fetch(`http://localhost:8080/api/admin/coupons/${editing.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      } else {
        await fetch('http://localhost:8080/api/admin/coupons', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
      }
      setModalOpen(false);
      await fetchCoupons();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể lưu'));
    } finally { setSaving(false); }
  };

  const handleToggle = async (id: number, active: boolean) => {
    try {
      await fetch(`http://localhost:8080/api/admin/coupons/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      });
      await fetchCoupons();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      await fetch(`http://localhost:8080/api/admin/coupons/${deleteTarget.id}`, { method: 'DELETE' });
      setDeleteTarget(null);
      await fetchCoupons();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xoá'));
    } finally { setSaving(false); }
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading) {
    return <div className="space-y-8">
      <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" /><h1 className="text-2xl font-bold text-gray-900">Quản lý mã giảm giá</h1></div>
      <div className="admin-card"><div className="admin-loading">{[...Array(3)].map((_, i) => <div key={i} className="admin-loading-row"><div className="admin-skeleton h-4 w-40" /><div className="admin-skeleton h-4 w-24" /></div>)}</div></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" /><h1>Quản lý mã giảm giá</h1>
          <span className="admin-page-count">{coupons.length} mã</span>
        </div>
        <button onClick={openCreate} className="admin-btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Thêm mã
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Giảm giá</th>
                <th>Đơn tối thiểu</th>
                <th className="text-center">Đã dùng</th>
                <th className="text-center">Giới hạn</th>
                <th className="text-center">Hạn dùng</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c.id}>
                  <td><span className="font-mono font-bold text-blue-600">{c.code}</span></td>
                  <td>
                    <span className="font-semibold text-gray-900">
                      {(c.discountType === 'PERCENT' || c.discountType === 'PERCENTAGE') ? `${c.discountValue}%` : `${c.discountValue.toLocaleString('vi-VN')}đ`}
                    </span>
                  </td>
                  <td className="text-gray-500">{c.minOrderValue ? `${c.minOrderValue.toLocaleString('vi-VN')}đ` : '—'}</td>
                  <td className="text-center">{c.usedCount}</td>
                  <td className="text-center">{c.maxUses || '∞'}</td>
                  <td className="text-center text-xs">
                    {c.expiryDate ? (
                      <span className={isExpired(c.expiryDate) ? 'text-red-500' : 'text-gray-500'}>
                        {new Date(c.expiryDate).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="text-center">
                    {isExpired(c.expiryDate) ? (
                      <span className="admin-badge-error"><span className="admin-badge-dot" />Hết hạn</span>
                    ) : c.active ? (
                      <span className="admin-badge-success"><span className="admin-badge-dot" />Hoạt động</span>
                    ) : (
                      <span className="admin-badge-default"><span className="admin-badge-dot" />Tắt</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleToggle(c.id, c.active)}
                        className={`admin-btn-icon-sm ${c.active ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}
                        title={c.active ? 'Tắt' : 'Bật'}>
                        {c.active ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                      </button>
                      <button onClick={() => openEdit(c)} className="admin-btn-icon-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="admin-btn-icon-sm text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={8}><div className="admin-empty"><p className="admin-empty-title">Chưa có mã giảm giá</p></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xoá mã giảm giá</h3>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-6">
              Bạn có chắc muốn xoá mã <strong className="text-gray-900">{deleteTarget.code}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">Huỷ</button>
              <button onClick={handleDelete} disabled={saving}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50">
                {saving ? 'Đang xoá...' : 'Xoá'}</button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">{editing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h3>
                <button onClick={() => setModalOpen(false)} className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã giảm giá</label>
                  <input type="text" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required
                    className="admin-input font-mono uppercase" placeholder="VD: SALE50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại</label>
                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })} className="admin-select">
                      <option value="PERCENT">Phần trăm</option>
                      <option value="FIXED">Số tiền cố định</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá trị</label>
                    <input type="number" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required
                      className="admin-input" placeholder={form.discountType === 'PERCENT' || form.discountType === 'PERCENTAGE' ? '10' : '50000'} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Đơn tối thiểu</label>
                    <input type="number" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })}
                      className="admin-input" placeholder="0 = không yêu cầu" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượt dùng</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                      className="admin-input" placeholder="Để trống = không giới hạn" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày hết hạn</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })}
                    className="admin-input" />
                </div>
                <div className="flex gap-3 pt-3 border-t border-gray-100">
                  <button type="submit" disabled={saving} className="admin-btn-primary">
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

export default ManageCoupons;