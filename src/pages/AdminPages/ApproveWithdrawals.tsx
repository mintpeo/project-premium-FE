import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface SellerWithBalance {
  id: number; fullName: string; email: string; phoneNumber: string;
  sellerVerified: boolean;
  pendingAmount: number; availableAmount: number; totalEarned: number;
}

interface CommissionRecord {
  id: number;
  seller: { id: number; fullName: string; email: string };
  amount: number; note: string;
  createdAt: string;
  admin?: { fullName: string; email: string };
}

const USE_MOCK = true;

const MOCK_SELLERS: SellerWithBalance[] = [
  { id: 6, fullName: 'Nguyễn Phùng An', email: 'phungana11@gmail.com', phoneNumber: '000292323', sellerVerified: true, pendingAmount: 2500000, availableAmount: 506900, totalEarned: 506900 },
];
const MOCK_COMMISSION_HISTORY: CommissionRecord[] = [];

const ApproveWithdrawals = () => {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<SellerWithBalance[]>(USE_MOCK ? MOCK_SELLERS : []);
  const [history, setHistory] = useState<CommissionRecord[]>(USE_MOCK ? MOCK_COMMISSION_HISTORY : []);
  const [loading, setLoading] = useState(!USE_MOCK);
  const [payModal, setPayModal] = useState<SellerWithBalance | null>(null);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [paying, setPaying] = useState(false);

  const totalRevenue = USE_MOCK ? 10000000 : 0;
  const totalPaid = history.reduce((sum, r) => sum + r.amount, 0);
  const remainingRevenue = totalRevenue - totalPaid;

  const fetchData = async () => {
    if (USE_MOCK) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/sellers-with-balance');
      if (res.ok) setSellers(await res.json());
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    if (USE_MOCK) return;
    fetchData();
  }, []);

  const handlePay = async () => {
    if (!payModal || !payAmount) return;
    const amount = parseInt(payAmount);
    if (isNaN(amount) || amount <= 0) { alert('Số tiền không hợp lệ'); return; }
    if (amount > payModal.totalEarned) { alert('Số tiền vượt quá thu nhập của seller'); return; }
    if (amount > remainingRevenue) { alert('Số dư khả dụng không đủ'); return; }
    setPaying(true);
    if (USE_MOCK) {
      await new Promise(r => setTimeout(r, 500));
      const newEntry: CommissionRecord = {
        id: Date.now(),
        seller: { id: payModal.id, fullName: payModal.fullName, email: payModal.email },
        amount, note: payNote,
        createdAt: new Date().toISOString(),
        admin: { fullName: user?.fullName || 'Admin', email: user?.email || '' },
      };
      setHistory(prev => [newEntry, ...prev]);
      const updated = sellers.map(s => s.id === payModal.id ? { ...s, availableAmount: s.availableAmount + amount } : s);
      setSellers(updated);
      const stored = localStorage.getItem('seller_balance');
      const existing = stored ? JSON.parse(stored) : { availableAmount: 506900, totalEarned: 506900 };
      localStorage.setItem('seller_balance', JSON.stringify({ ...existing, availableAmount: existing.availableAmount + amount }));
      localStorage.setItem('commission_history', JSON.stringify([newEntry, ...history]));
      window.dispatchEvent(new CustomEvent('balance-update'));
      setPayModal(null); setPayAmount(''); setPayNote('');
      setPaying(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:8080/api/admin/pay-commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sellerId: payModal.id, amount, adminId: user!.id, note: payNote }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error); }
      setPayModal(null); setPayAmount(''); setPayNote('');
      await fetchData();
    } catch (err: any) { alert('Lỗi: ' + err.message); }
    finally { setPaying(false); }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" /><h1 className="text-2xl font-bold text-gray-900">Trả hoa hồng</h1></div>
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="admin-card p-5"><div className="admin-skeleton h-5 w-48" /></div>)}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Trả hoa hồng</h1>
          <span className="admin-page-count">{sellers.length} seller</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-blue-100 mb-1">Tổng doanh thu</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-emerald-100 mb-1">Đã trả seller</p>
          <p className="text-2xl font-bold">{totalPaid.toLocaleString('vi-VN')}đ</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-sm">
          <p className="text-sm text-amber-100 mb-1">Còn lại</p>
          <p className="text-2xl font-bold">{remainingRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      {sellers.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="admin-empty-title">Chưa có seller nào</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th className="text-right">Thu nhập</th>
                  <th className="text-right">Đã nhận</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map(s => (
                  <tr key={s.id}>
                    <td>
                      <p className="font-medium text-gray-900">{s.fullName}</p>
                      <p className="text-xs text-gray-400">{s.email}</p>
                    </td>
                    <td className="text-right text-gray-900 font-bold">{s.totalEarned.toLocaleString('vi-VN')}đ</td>
                    <td className="text-right text-emerald-600 font-semibold">{s.availableAmount.toLocaleString('vi-VN')}đ</td>
                    <td className="text-center">
                      <button onClick={() => { setPayModal(s); setPayAmount(String(s.totalEarned)); }}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-xs font-medium">
                        Trả hoa hồng
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Lịch sử trả hoa hồng</h3>
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Chưa có lịch sử trả hoa hồng</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Seller</th>
                  <th className="text-right">Số tiền</th>
                  <th className="text-left">Ghi chú</th>
                  <th className="text-right">Ngày trả</th>
                </tr>
              </thead>
              <tbody>
                {history.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-gray-900">{r.seller.fullName}</td>
                    <td className="text-right font-semibold text-emerald-600">{r.amount.toLocaleString('vi-VN')}đ</td>
                    <td className="text-gray-500 text-sm">{r.note || '—'}</td>
                    <td className="text-right text-gray-500 text-sm">
                      {new Date(r.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {payModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setPayModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Trả hoa hồng</h3>
            <p className="text-sm text-gray-500 mb-4">Seller: <strong>{payModal.fullName}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Thu nhập của seller</label>
                <p className="text-xl font-bold text-gray-900">{payModal.totalEarned.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Đã nhận</label>
                <p className="text-lg font-semibold text-emerald-600">{payModal.availableAmount.toLocaleString('vi-VN')}đ</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Số tiền trả *</label>
                <input type="number" value={payAmount} onChange={e => setPayAmount(e.target.value)}
                  className={`admin-input ${payAmount && parseInt(payAmount) > payModal.totalEarned ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
                  placeholder="Nhập số tiền" />
                {payAmount && parseInt(payAmount) > remainingRevenue && (
                  <p className="text-xs text-red-600 mt-1.5">Số dư khả dụng không đủ</p>
                )}
                {payAmount && parseInt(payAmount) > payModal.totalEarned && (
                  <p className="text-xs text-red-600 mt-1.5">Vượt quá thu nhập của seller</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Ghi chú</label>
                <input value={payNote} onChange={e => setPayNote(e.target.value)}
                  className="admin-input" placeholder="Nội dung (không bắt buộc)" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setPayModal(null); setPayAmount(''); setPayNote(''); }}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={handlePay} disabled={paying || !payAmount || parseInt(payAmount) > payModal.totalEarned || parseInt(payAmount) > remainingRevenue}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
                {paying ? 'Đang xử lý...' : 'Xác nhận trả'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApproveWithdrawals;
