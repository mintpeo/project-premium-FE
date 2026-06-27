import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, Wallet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MOCK_REVENUE_DATA = [
  { date: '01/06', revenue: 250000 }, { date: '07/06', revenue: 320000 },
  { date: '13/06', revenue: 350000 }, { date: '19/06', revenue: 420000 },
  { date: '25/06', revenue: 280000 },
];
const USE_MOCK_SELLER = true;
const defaultBalance = () => {
  const stored = localStorage.getItem('seller_balance');
  return stored ? JSON.parse(stored) : { availableAmount: 506900, totalEarned: 506900 };
};

const PersonalRevenue = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(USE_MOCK_SELLER ? defaultBalance() : { availableAmount: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(!USE_MOCK_SELLER);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>(USE_MOCK_SELLER ? MOCK_REVENUE_DATA : []);
  const [earningCount, setEarningCount] = useState(0);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawHistory, setWithdrawHistory] = useState<any[]>([]);
  const [commissionHistory, setCommissionHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    fetchData();
    fetchWithdrawHistory();
    const syncAll = () => {
      const stored = localStorage.getItem('seller_balance');
      if (stored) setBalance(JSON.parse(stored));
      const ch = localStorage.getItem('commission_history');
      if (ch) setCommissionHistory(JSON.parse(ch));
    };
    window.addEventListener('balance-update', syncAll);
    syncAll();
    const interval = setInterval(syncAll, 2000);
    return () => {
      window.removeEventListener('balance-update', syncAll);
      clearInterval(interval);
    };
  }, [user]);

  const fetchData = async () => {
    if (USE_MOCK_SELLER) { setLoading(false); return; }
    setLoading(true);
    try {
      const [resBalance, resRevenue] = await Promise.all([
        fetch(`http://localhost:8080/api/seller/balance/${user!.id}`),
        fetch(`http://localhost:8080/api/seller/revenue/${user!.id}`),
      ]);

      if (resBalance.ok) {
        const d = await resBalance.json();
        setBalance(d);
      }

      if (resRevenue.ok) {
        const d = await resRevenue.json();
        if (Array.isArray(d)) {
          setRevenueData(d);
          setEarningCount(d.reduce((sum: number, r: any) => sum + (r.revenue || 0), 0) > 0 ? d.length : 0);
        }
      }
    } catch (err) {
      console.error('Lỗi tải doanh thu:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWithdrawHistory = async () => {
    if (USE_MOCK_SELLER) return;
    if (!user) return;
    try {
      const res = await fetch(`http://localhost:8080/api/seller/withdraw/${user.id}`);
      if (res.ok) setWithdrawHistory(await res.json());
    } catch {}
  };

  const handleWithdraw = async () => {
    if (!user || !withdrawAmount) return;
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0) { alert('Số tiền không hợp lệ'); return; }
    if (amount > balance.availableAmount) { alert('Số dư khả dụng không đủ'); return; }
    setWithdrawing(true);
    if (USE_MOCK_SELLER) {
      await new Promise(r => setTimeout(r, 500));
      const newBalance = { availableAmount: balance.availableAmount - amount, totalEarned: balance.totalEarned + amount };
      setBalance(newBalance);
      localStorage.setItem('seller_balance', JSON.stringify(newBalance));
      const newEntry = { id: Date.now(), seller: { id: user.id, fullName: user.fullName, email: user.email }, amount, status: 'PENDING', note: withdrawNote, adminNote: null, createdAt: new Date().toISOString(), processedAt: null };
      setWithdrawHistory(prev => [newEntry, ...prev]);
      setWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawNote('');
      setWithdrawing(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/seller/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: user.id, amount, note: withdrawNote }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Lỗi'); }
      setWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawNote('');
      await fetchData();
      await fetchWithdrawHistory();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
    finally { setWithdrawing(false); }
  };

  const exportExcel = () => {
    const rows = [['Ngày', 'Doanh thu']];
    revenueData.forEach(r => rows.push([r.date, r.revenue.toLocaleString('vi-VN') + 'đ']));
    rows.push(['Tổng', balance.totalEarned.toLocaleString('vi-VN') + 'đ']);
    const csv = rows.map(r => r.join(',')).join('\n');
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `doanh-thu-${user?.id}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Doanh thu cá nhân</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="admin-card"><div className="p-6 space-y-3"><div className="admin-skeleton h-4 w-24" /><div className="admin-skeleton h-8 w-32" /></div></div>
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
          <h1>Doanh thu cá nhân</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWithdrawModal(true)}
            className="admin-btn-primary">
            <Wallet className="w-4 h-4" /> Rút tiền
          </button>
          <button onClick={exportExcel} className="admin-btn-primary">
            <Download className="w-4 h-4" /> Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-emerald-100 mb-1">Đã nhận</p>
          <p className="text-2xl font-bold">{balance.availableAmount.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-violet-100 mb-1">Tổng thu nhập</p>
          <p className="text-2xl font-bold">{balance.totalEarned.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      {revenueData.length > 0 && (
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu theo ngày</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#f59e0b', fontWeight: 600 }}
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  />
                  <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {revenueData.length === 0 && !loading && (
        <div className="admin-card">
          <div className="admin-empty py-12">
            <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="admin-empty-title">Chưa có doanh thu</p>
            <p className="admin-empty-desc">Khi có đơn hàng được duyệt, doanh thu sẽ hiển thị tại đây</p>
          </div>
        </div>
      )}

      {commissionHistory.length > 0 && (
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch sử nhận hoa hồng</h3>
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th className="admin-th">Admin</th>
                    <th className="admin-th text-right">Số tiền</th>
                    <th className="admin-th text-right">Ngày</th>
                    <th className="admin-th text-left">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {commissionHistory.map((w: any) => (
                    <tr key={w.id} className="admin-tr">
                      <td className="admin-td">
                        <p className="text-sm font-medium text-gray-900">{w.admin?.fullName || 'Admin'}</p>
                        <p className="text-xs text-gray-400">{w.admin?.email || ''}</p>
                      </td>
                      <td className="admin-td text-right font-semibold text-emerald-600">+{w.amount.toLocaleString('vi-VN')}đ</td>
                      <td className="admin-td text-right text-gray-500">{new Date(w.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                      <td className="admin-td text-left text-gray-500">{w.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {withdrawHistory.length > 0 && (
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Lịch sử rút tiền</h3>
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th className="admin-th text-right">Số tiền</th>
                    <th className="admin-th text-right">Ngày</th>
                    <th className="admin-th text-left">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawHistory.map((w: any) => (
                    <tr key={w.id} className="admin-tr">
                      <td className="admin-td text-right font-semibold text-red-600">-{w.amount.toLocaleString('vi-VN')}đ</td>
                      <td className="admin-td text-right text-gray-500">{new Date(w.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                      <td className="admin-td text-left text-gray-500">{w.note || w.adminNote || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {withdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setWithdrawModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rút tiền</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Số dư khả dụng</label>
                <p className="text-2xl font-bold text-emerald-600">{balance.availableAmount.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Số tiền rút *</label>
                <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)}
                  className={`admin-input ${withdrawAmount && parseInt(withdrawAmount) > balance.availableAmount ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Nhập số tiền" max={balance.availableAmount} />
                {withdrawAmount && parseInt(withdrawAmount) > 0 && parseInt(withdrawAmount) <= balance.availableAmount && (
                  <p className="text-xs text-emerald-600 mt-1.5">✓ Số dư khả dụng đủ</p>
                )}
                {withdrawAmount && parseInt(withdrawAmount) > balance.availableAmount && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                    Số dư khả dụng không đủ
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <input value={withdrawNote} onChange={e => setWithdrawNote(e.target.value)}
                  className="admin-input" placeholder="Nội dung (không bắt buộc)" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setWithdrawModal(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={handleWithdraw} disabled={withdrawing || !withdrawAmount || parseInt(withdrawAmount) > balance.availableAmount}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                {withdrawing ? 'Đang xử lý...' : 'Rút tiền'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalRevenue;
