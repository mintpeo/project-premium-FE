import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Users, Gift, ChevronRight, Plus, Check, X, Clock, TrendingUp, TrendingDown } from 'lucide-react';

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

interface PointHistory {
  type: string;
  points: number;
  orderId: number;
  productName: string;
  productImg: string;
  createdAt: string;
}

const SellerLoyalty = () => {
  const { user } = useAuth();
  const [program, setProgram] = useState<LoyaltyProgram>({ id: 0, pointRate: 1, pointValue: 100, minOrderValue: 0, active: true });
  const [customers, setCustomers] = useState<CustomerPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...program });
  const [saving, setSaving] = useState(false);

  const [historyModal, setHistoryModal] = useState<{ customer: CustomerPoint; history: PointHistory[] } | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (user) fetchData();
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

  const openHistory = useCallback(async (customer: CustomerPoint) => {
    if (!user) return;
    setHistoryLoading(true);
    setHistoryModal({ customer, history: [] });
    try {
      const res = await fetch(`http://localhost:8080/api/seller/loyalty/customers/${user.id}/history/${customer.user.id}`);
      if (res.ok) {
        setHistoryModal({ customer, history: await res.json() });
      }
    } catch {} finally { setHistoryLoading(false); }
  }, [user]);

  const handleSave = async () => {
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
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="cursor-pointer hover:bg-gray-50" onClick={() => openHistory(c)}>
                    <td>
                      <p className="font-medium text-gray-900">{c.user.fullName}</p>
                      <p className="text-xs text-gray-400">{c.user.email}</p>
                    </td>
                    <td className="text-right font-bold text-orange-600">{c.points.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-emerald-600 font-semibold">+{c.totalEarned.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-red-500 font-semibold">-{c.totalRedeemed.toLocaleString('vi-VN')}</td>
                    <td className="text-right text-gray-500 text-sm">{formatDate(c.updatedAt)}</td>
                    <td className="text-center">
                      <ChevronRight className="w-4 h-4 text-gray-300 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {historyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setHistoryModal(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lịch sử điểm</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {historyModal.customer.user.fullName} — {historyModal.customer.user.email}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Điểm hiện tại</p>
                  <p className="text-lg font-bold text-orange-600">{historyModal.customer.points.toLocaleString('vi-VN')}</p>
                </div>
                <button onClick={() => setHistoryModal(null)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {historyLoading ? (
                <div className="text-center py-12 text-gray-400">Đang tải...</div>
              ) : historyModal.history.length === 0 ? (
                <div className="text-center py-12 text-gray-400">Chưa có giao dịch điểm nào</div>
              ) : (
                <div className="space-y-3">
                  {historyModal.history.map((h, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        h.type === 'EARNED' ? 'bg-emerald-100' : 'bg-red-100'
                      }`}>
                        {h.type === 'EARNED' ? (
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      {h.productImg && (
                        <img src={h.productImg} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{h.productName}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(h.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${h.type === 'EARNED' ? 'text-emerald-600' : 'text-red-500'}`}>
                          {h.type === 'EARNED' ? '+' : '-'}{h.points.toLocaleString('vi-VN')}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Đơn #PK-{h.orderId}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
