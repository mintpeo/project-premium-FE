import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Tags, Plus, Edit2, Trash2 } from 'lucide-react';

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
}

const SellerCoupons = () => {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ code: '', discountType: 'PERCENT', discountValue: '', minOrderValue: '', maxUses: '', expiryDate: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) fetchCoupons();
  }, [user]);

  const fetchCoupons = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/coupons/${user.id}`);
      if (res.ok) setCoupons(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ code: '', discountType: 'PERCENT', discountValue: '', minOrderValue: '', maxUses: '', expiryDate: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderValue: c.minOrderValue ? String(c.minOrderValue) : '',
      maxUses: c.maxUses ? String(c.maxUses) : '',
      expiryDate: c.expiryDate ? c.expiryDate.slice(0, 16) : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) { alert('Vui lòng nhập đầy đủ thông tin'); return; }
    setSaving(true);
    try {
      const body: any = {
        code: form.code,
        discountType: form.discountType,
        discountValue: parseInt(form.discountValue),
        sellerId: user!.id,
      };
      if (form.minOrderValue) body.minOrderValue = parseInt(form.minOrderValue);
      if (form.maxUses) body.maxUses = parseInt(form.maxUses);
      if (form.expiryDate) body.expiryDate = form.expiryDate + ':00';

      const url = editing
        ? `http://localhost:8080/api/seller/coupons/${editing.id}`
        : 'http://localhost:8080/api/seller/coupons';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Lỗi'); }
      setModalOpen(false);
      await fetchCoupons();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Xoá mã giảm giá này?')) return;
    try {
      await fetch(`http://localhost:8080/api/seller/coupons/${id}`, { method: 'DELETE' });
      await fetchCoupons();
    } catch { alert('Xoá thất bại'); }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Mã giảm giá</h1>
        </div>
        <div className="admin-card"><div className="admin-loading">{[...Array(3)].map((_, i) => <div key={i} className="admin-loading-row"><div className="admin-skeleton h-4 w-48" /><div className="admin-skeleton h-4 w-24" /></div>)}</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Mã giảm giá</h1>
          <span className="admin-page-count">{coupons.length} mã</span>
        </div>
        <button onClick={openCreate} className="admin-btn-primary">
          <Plus className="w-4 h-4" /> Thêm mã giảm giá
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <Tags className="admin-empty-icon" />
            <p className="admin-empty-title">Chưa có mã giảm giá</p>
            <p className="admin-empty-desc">Tạo mã giảm giá để thu hút khách hàng</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Loại</th>
                  <th>Giá trị</th>
                  <th>Đơn tối thiểu</th>
                  <th>Đã dùng / Tối đa</th>
                  <th>Hạn sử dụng</th>
                  <th>Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td><span className="font-mono font-bold text-blue-600">{c.code}</span></td>
                    <td>{c.discountType === 'PERCENT' ? '%' : 'VNĐ'}</td>
                    <td className="font-semibold">{c.discountValue.toLocaleString('vi-VN')}{c.discountType === 'PERCENT' ? '%' : 'đ'}</td>
                    <td>{c.minOrderValue ? c.minOrderValue.toLocaleString('vi-VN') + 'đ' : '—'}</td>
                    <td>{c.usedCount} / {c.maxUses || '∞'}</td>
                    <td className="text-sm">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString('vi-VN') : '—'}</td>
                    <td><span className={c.active ? 'admin-badge-success' : 'admin-badge-error'}><span className="admin-badge-dot" />{c.active ? 'Hoạt động' : 'Tắt'}</span></td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(c)} className="admin-btn-ghost p-2 text-blue-600 hover:bg-blue-50"><Edit2 size={15} /></button>
                        <button onClick={() => handleDelete(c.id)} className="admin-btn-ghost p-2 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editing ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Mã giảm giá *</label>
                <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" placeholder="VD: SALE10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Loại giảm giá</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm">
                    <option value="PERCENT">Phần trăm (%)</option>
                    <option value="FIXED">Số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Giá trị *</label>
                  <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Đơn tối thiểu</label>
                  <input type="number" value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lượt dùng tối đa</label>
                  <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ngày hết hạn</label>
                <input type="datetime-local" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">{saving ? 'Đang lưu...' : editing ? 'Cập nhật' : 'Tạo mới'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerCoupons;
