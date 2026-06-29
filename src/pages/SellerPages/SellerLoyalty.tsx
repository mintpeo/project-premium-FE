import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Users, Plus, Check, X, Gift } from 'lucide-react';

interface LoyaltyProgram {
  id: number;
  pointRate: number;
  pointValue: number;
  minOrderValue: number;
  active: boolean;
}

interface CustomerPoint {
  id: number;
  user: { id: number; fullName: string; email: string };
  points: number;
  totalEarned: number;
  totalRedeemed: number;
  updatedAt: string;
}

const USE_MOCK = true;

const MOCK_PROGRAM: LoyaltyProgram = {
  id: 1,
  pointRate: 1,
  pointValue: 100,
  minOrderValue: 50000,
  active: true,
};

const MOCK_CUSTOMERS: CustomerPoint[] = [
  { id: 1, user: { id: 2, fullName: 'Nguyễn Văn A', email: 'vana@gmail.com' }, points: 1200, totalEarned: 2500, totalRedeemed: 1300, updatedAt: '2026-06-28T10:00:00' },
  { id: 2, user: { id: 3, fullName: 'Trần Thị B', email: 'thib@gmail.com' }, points: 850, totalEarned: 1500, totalRedeemed: 650, updatedAt: '2026-06-27T15:30:00' },
  { id: 3, user: { id: 4, fullName: 'Lê Văn C', email: 'vanc@gmail.com' }, points: 3200, totalEarned: 4500, totalRedeemed: 1300, updatedAt: '2026-06-26T09:15:00' },
];

const SellerLoyalty = () => {
  const { user } = useAuth();
  const [program, setProgram] = useState<LoyaltyProgram>(USE_MOCK ? MOCK_PROGRAM : { id: 0, pointRate: 1, pointValue: 100, minOrderValue: 0, active: true });
  const [customers, setCustomers] = useState<CustomerPoint[]>(USE_MOCK ? MOCK_CUSTOMERS : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...program });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!USE_MOCK && user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [progRes, custRes] = await Promise.all([
        fetch(`http://localhost:8080/api/seller/loyalty/${user.id}`),
        fetch(`http://localhost:8080/api/seller/loyalty/customers/${user.id}`),
      ]);
      if (progRes.ok) setProgram(await progRes.json());
      if (custRes.ok) setCustomers(await custRes.json());
    } catch {} finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (USE_MOCK) {
      setProgram({ ...editForm });
      setEditing(false);
      return;
    }
    if (!user) return;
    setSaving(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/loyalty/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Lưu thất bại');
      setProgram(await res.json());
      setEditing(false);
    } catch (err: any) { alert(err.message); }
    finally { setSaving(false); }
  };

  const formatDate = (d: string) => new Date(d).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit' });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" /><h1 className="text-2xl font-bold text-gray-900">Chương trình tích điểm</h1></div>
        <div className="admin-card p-6"><div className="admin-skeleton h-32 w-full" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Chương trình tích điểm</h1>
        </div>
        {!editing && (
          <button onClick={() => { setEditForm({ ...program }); setEditing(true); }} className="admin-btn-primary">
            <Settings className="w-4 h-4" /> Cấu hình
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-orange-100 mb-1">Tỷ lệ tích điểm</p>
          <p className="text-2xl font-bold">{program.pointRate} điểm / 1.000đ</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-blue-100 mb-1">Giá trị điểm</p>
          <p className="text-2xl font-bold">{program.pointValue}đ / 100 điểm</p>
        </div>
        <div className={`rounded-xl p-5 text-white shadow-sm ${program.active ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' : 'bg-gradient-to-br from-gray-400 to-gray-500'}`}>
          <p className="text-sm text-white/80 mb-1">Trạng thái</p>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${program.active ? 'bg-white' : 'bg-gray-200'}`} />
            <p className="text-xl font-bold">{program.active ? 'Đang hoạt động' : 'Đã tắt'}</p>
          </div>
        </div>
      </div>

      {program.minOrderValue > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-sm text-blue-700">
          <Gift className="w-4 h-4 inline mr-1.5" />
          Áp dụng cho đơn hàng từ <strong>{program.minOrderValue.toLocaleString('vi-VN')}đ</strong>
        </div>
      )}

      <div className="admin-card">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Khách hàng tích điểm</h3>
            <span className="admin-page-count">{customers.length} khách</span>
          </div>
        </div>
        {customers.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chưa có khách hàng nào tích điểm</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th className="text-right">Điểm hiện tại</th>
                  <th className="text-right">Đã tích</th>
                  <th className="text-right">Đã dùng</th>
                  <th className="text-right">Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <p className="font-medium text-gray-900">{c.user.fullName}</p>
                      <p className="text-xs text-gray-400">{c.user.email}</p>
                    </td>
                    <td className="text-right font-bold text-orange-600">{c.points.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-emerald-600 font-semibold">+{c.totalEarned.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-red-500 font-semibold">-{c.totalRedeemed.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-gray-500 text-sm">{formatDate(c.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Cấu hình tích điểm</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Tỷ lệ tích điểm (điểm / 1.000đ)</label>
                <input type="number" value={editForm.pointRate} onChange={e => setEditForm({ ...editForm, pointRate: parseInt(e.target.value) || 0 })}
                  className="admin-input" min={0} />
                <p className="text-xs text-gray-400 mt-1">VD: 1 = 1 điểm cho mỗi 1.000đ chi tiêu</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Giá trị điểm (VNĐ / 100 điểm)</label>
                <input type="number" value={editForm.pointValue} onChange={e => setEditForm({ ...editForm, pointValue: parseInt(e.target.value) || 0 })}
                  className="admin-input" min={0} />
                <p className="text-xs text-gray-400 mt-1">VD: 100 = 100đ giảm cho mỗi 100 điểm</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Đơn hàng tối thiểu (VNĐ)</label>
                <input type="number" value={editForm.minOrderValue} onChange={e => setEditForm({ ...editForm, minOrderValue: parseInt(e.target.value) || 0 })}
                  className="admin-input" min={0} />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Kích hoạt</label>
                <button onClick={() => setEditForm({ ...editForm, active: !editForm.active })}
                  className={`relative w-11 h-6 rounded-full transition-all ${editForm.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.active ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerLoyalty;
