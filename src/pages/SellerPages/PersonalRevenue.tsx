import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PersonalRevenue = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ pendingAmount: 0, availableAmount: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchData();
    fetchWithdrawHistory();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resBalance, resRevenue] = await Promise.all([
        fetch(`http://localhost:8080/api/seller/balance/${user!.id}`),
        fetch(`http://localhost:8080/api/seller/revenue/${user!.id}?period=30d`),
      ]);
      if (resBalance.ok) setBalance(await resBalance.json());
      if (resRevenue.ok) {
        const data = await resRevenue.json();
        if (Array.isArray(data)) setRevenueData(data);
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu doanh thu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawHistory = async () => {
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/api/seller/withdraw/${user.id}`);
      if (res.ok) setWithdrawHistory(await res.json());
    } catch {}
  };

  const handleWithdraw = async () => {
    const amount = parseInt(withdrawAmount);
    if (!amount || amount <= 0) { alert('Vui lòng nhập số tiền hợp lệ'); return; }
    if (amount > balance.availableAmount) { alert('Số dư khả dụng không đủ'); return; }
    setWithdrawing(true);
    try {
      const res = await fetch('http://localhost:8080/api/seller/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: user!.id, amount, note: withdrawNote }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Lỗi'); }
      alert('Yêu cầu rút tiền đã được tạo');
      setWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawNote('');
      await fetchData();
      await fetchWithdrawHistory();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Doanh thu</h1>
        </div>
        <div className="admin-card"><div className="p-6"><div className="admin-skeleton h-8 w-48" /></div></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Doanh thu</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="admin-card">
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">Đang chờ duyệt</p>
            <p className="text-2xl font-bold text-amber-600">{balance.pendingAmount.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">Có thể rút</p>
            <p className="text-2xl font-bold text-emerald-600">{balance.availableAmount.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-1">Tổng đã nhận</p>
            <p className="text-2xl font-bold text-blue-600">{balance.totalEarned.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Biểu đồ doanh thu (30 ngày)</h3>
            <button onClick={fetchData} className="admin-btn-ghost text-sm"><Download size={16} /> Làm mới</button>
          </div>
          {revenueData.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'} />
                  <Tooltip formatter={(v: number) => v.toLocaleString('vi-VN') + 'đ'} />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="admin-empty"><p className="admin-empty-desc">Chưa có dữ liệu</p></div>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Rút tiền</h3>
            <button onClick={() => setWithdrawModal(true)}
              disabled={balance.availableAmount <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 text-sm">
              <Wallet size={16} className="inline mr-1" /> Rút tiền
            </button>
          </div>
          {withdrawHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Số tiền</th>
                    <th className="text-left">Ghi chú</th>
                    <th className="text-left">Trạng thái</th>
                    <th className="text-left">Ngày</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawHistory.map((w, i) => (
                    <tr key={w.id || i}>
                      <td className="font-semibold">{w.amount?.toLocaleString('vi-VN')}đ</td>
                      <td className="text-gray-500">{w.note || '—'}</td>
                      <td>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          w.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          w.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>{w.status === 'APPROVED' ? 'Đã duyệt' : w.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt'}</span>
                      </td>
                      <td className="text-gray-500 text-sm">{w.createdAt ? new Date(w.createdAt).toLocaleString('vi-VN') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Chưa có yêu cầu rút tiền</p>
          )}
        </div>
      </div>

      {withdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setWithdrawModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Rút tiền</h3>
            <p className="text-sm text-gray-500 mb-4">Số dư khả dụng: <strong className="text-emerald-600">{balance.availableAmount.toLocaleString('vi-VN')}đ</strong></p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Số tiền</label>
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  className="admin-input" placeholder="Nhập số tiền muốn rút" max={balance.availableAmount} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <input value={withdrawNote} onChange={e => setWithdrawNote(e.target.value)}
                  className="admin-input" placeholder="Ghi chú (không bắt buộc)" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setWithdrawModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={handleWithdraw} disabled={withdrawing}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                {withdrawing ? 'Đang xử lý...' : 'Gửi yêu cầu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalRevenue;
