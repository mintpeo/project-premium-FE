import React, { useState, useEffect } from 'react';

interface RefundUser { id: number; email: string; fullName: string; }
interface RefundOrder { id: number; totalPrice: number; orderStatus: string; orderDate: string; }
interface RefundRequest {
  id: number;
  order: RefundOrder;
  user: RefundUser;
  reason: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
  processedAt: string | null;
  processedBy: RefundUser | null;
}

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

const ManageRefunds = () => {
  const [requests, setRequests] = useState<RefundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/refunds');
      if (res.ok) setRequests(await res.json());
    } catch { setRequests([]); }
    finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/refunds/stats');
      if (res.ok) setStats(await res.json());
    } catch {}
  };

  const handleProcess = async (id: number, status: string) => {
    const note = status === 'REJECTED' ? window.prompt('Lý do từ chối:') : '';
    if (status === 'REJECTED' && !note) return;
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const res = await fetch(`http://localhost:8080/api/admin/refunds/${id}/process`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note || null, adminId: user?.id })
      });
      if (!res.ok) throw new Error('Xử lý thất bại');
      await fetchRequests();
      await fetchStats();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || ''));
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'admin-badge-success';
      case 'REJECTED': return 'admin-badge-error';
      default: return 'admin-badge-warning';
    }
  };

  if (loading) {
    return <div className="space-y-8">
      <div className="flex items-center gap-3"><div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" /><h1 className="text-2xl font-bold text-gray-900">Xử lý hoàn tiền</h1></div>
      <div className="admin-card"><div className="admin-loading">{[...Array(3)].map((_, i) => <div key={i} className="admin-loading-row"><div className="admin-skeleton h-4 w-48" /><div className="admin-skeleton h-4 w-64" /></div>)}</div></div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" /><h1>Xử lý hoàn tiền & Khiếu nại</h1>
          <span className="admin-page-count">{requests.length} yêu cầu</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="admin-card"><div className="p-4 text-center"><p className="text-xs text-gray-400 uppercase font-medium">Tổng</p><p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p></div></div>
        <div className="admin-card"><div className="p-4 text-center"><p className="text-xs text-gray-400 uppercase font-medium">Chờ xử lý</p><p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p></div></div>
        <div className="admin-card"><div className="p-4 text-center"><p className="text-xs text-gray-400 uppercase font-medium">Đã duyệt</p><p className="text-2xl font-bold text-emerald-600 mt-1">{stats.approved}</p></div></div>
        <div className="admin-card"><div className="p-4 text-center"><p className="text-xs text-gray-400 uppercase font-medium">Từ chối</p><p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p></div></div>
      </div>

      <div className="space-y-4">
        {requests.map(req => (
          <div key={req.id} className="admin-card">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={statusBadge(req.status)}>
                      <span className="admin-badge-dot" />{statusLabels[req.status] || req.status}
                    </span>
                    <span className="text-xs text-gray-400">#{req.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Khách hàng</p>
                      <p className="text-gray-900 font-medium">{req.user?.fullName || req.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium">Đơn hàng</p>
                      <p className="text-gray-900 font-medium">#{req.order?.id} · {req.order?.totalPrice?.toLocaleString('vi-VN')}đ</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 uppercase font-medium">Lý do</p>
                      <p className="text-gray-700 mt-1 bg-gray-50 rounded-xl p-3 text-sm leading-relaxed">{req.reason}</p>
                    </div>
                    {req.adminNote && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-400 uppercase font-medium">Phản hồi</p>
                        <p className="text-gray-700 mt-1 bg-blue-50 rounded-xl p-3 text-sm leading-relaxed">{req.adminNote}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                {req.status === 'PENDING' && (
                  <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => handleProcess(req.id, 'APPROVED')}
                      className="admin-btn-primary text-sm px-4 py-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Duyệt
                    </button>
                    <button onClick={() => handleProcess(req.id, 'REJECTED')}
                      className="admin-btn-ghost text-sm px-4 py-2 text-red-600 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Từ chối
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="admin-card">
            <div className="admin-empty">
              <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="admin-empty-title">Không có yêu cầu hoàn tiền</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRefunds;