import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
  id: number;
  product: { id: number; name: string; img: string };
  quantity: number;
  typeUser: string;
  duration: string;
  keyCode: string;
  price: number;
}

interface Order {
  id: number;
  user: { id: number; email: string; fullName: string };
  fullName: string;
  phoneNumber: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  orderDate: string;
  note: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ thanh toán',
  PROCESSING: 'Chờ xác nhận',
  SUCCESS: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

const paymentLabels: Record<string, string> = {
  PENDING: 'Chưa thanh toán',
  PAID: 'Đã thanh toán',
};

const nextStatuses: Record<string, { label: string; status: string }[]> = {
  PENDING: [{ label: 'Xác nhận đơn hàng', status: 'PROCESSING' }, { label: 'Huỷ đơn hàng', status: 'CANCELLED' }],
  PROCESSING: [{ label: 'Hoàn thành', status: 'SUCCESS' }, { label: 'Huỷ đơn hàng', status: 'CANCELLED' }],
  SUCCESS: [],
  CANCELLED: [],
};

const ProcessOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [lastSeen, setLastSeen] = useState<number>(() => {
    const saved = localStorage.getItem('seller_orders_last_seen');
    return saved ? Number(saved) : Date.now();
  });
  const [activeTab, setActiveTab] = useState<'orders' | 'refunds'>('orders');
  const [refunds, setRefunds] = useState<any[]>([]);
  const [refundsLoading, setRefundsLoading] = useState(false);
  const [processingRefund, setProcessingRefund] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: number; sellerId: number } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    if (user) fetchOrders();
    const onVisible = () => { if (!document.hidden) fetchOrders(); };
    const onOrderUpdate = () => fetchOrders();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('order-update', onOrderUpdate);
    window.addEventListener('storage', (e) => { if (e.key === 'order_update') fetchOrders(); });
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('order-update', onOrderUpdate);
    };
  }, [user]);

  useEffect(() => {
    if (user && activeTab === 'refunds') fetchRefunds();
  }, [user, activeTab]);

  const handleFilterClick = (s: string) => {
    setStatusFilter(s);
    if (s === 'SUCCESS' || s === 'CANCELLED') {
      const now = Date.now();
      setLastSeen(now);
      localStorage.setItem('seller_orders_last_seen', String(now));
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/orders/${user.id}`);
      if (!res.ok) throw new Error('Không thể tải đơn hàng');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      await fetchOrders();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật'));
    } finally {
      setUpdatingId(null);
    }
  };

  const fetchRefunds = async () => {
    if (!user) return;
    setRefundsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/refunds/${user.id}`);
      if (res.ok) setRefunds(await res.json());
    } catch {} finally { setRefundsLoading(false); }
  };

  const handleProcessRefund = async (id: number, status: string, note?: string) => {
    if (!user) return;
    setProcessingRefund(id);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/refunds/${id}/process`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNote: note || '', sellerId: user.id }),
      });
      if (!res.ok) throw new Error('Xử lý thất bại');
      await fetchRefunds();
    } catch (err: any) { alert(err.message); }
    finally { setProcessingRefund(null); }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'admin-badge-success';
      case 'PROCESSING': return 'admin-badge-warning';
      case 'PENDING': return 'admin-badge-default';
      case 'CANCELLED': return 'admin-badge-error';
      default: return 'admin-badge-default';
    }
  };

  const filtered = orders.filter(o => {
    if (statusFilter && o.orderStatus !== statusFilter) return false;
    if (!searchText) return true;
    const q = searchText.toLowerCase();
    const name = (o.fullName || o.user?.fullName || '').toLowerCase();
    const email = (o.user?.email || '').toLowerCase();
    return name.includes(q) || email.includes(q) || String(o.id).includes(q);
  });

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Xử lý đơn hàng</h1>
        </div>
        <div className="admin-card">
          <div className="admin-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-6">
                <div className="admin-skeleton h-4 w-20" />
                <div className="admin-skeleton h-4 w-28" />
                <div className="admin-skeleton h-4 w-40 flex-1" />
                <div className="admin-skeleton h-6 w-24 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const refundStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-100 text-emerald-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };
  const refundStatusLabel: Record<string, string> = {
    PENDING: 'Chờ xử lý', APPROVED: 'Đã duyệt', REJECTED: 'Từ chối',
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-3 mb-2">
        <button onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Đơn hàng
        </button>
        <button onClick={() => setActiveTab('refunds')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'refunds' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          Khiếu nại / Trả hàng {refunds.filter(r => r.status === 'PENDING').length > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">{refunds.filter(r => r.status === 'PENDING').length}</span>
          )}
        </button>
      </div>

      {activeTab === 'orders' && (
      <div>
        <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Xử lý đơn hàng</h1>
          <span className="admin-page-count">{filtered.length} đơn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 max-w-[200px] w-full">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm mã, tên, email..." value={searchText} onChange={e => setSearchText(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
          </div>
          <div className="flex gap-1.5">
            {['', 'PENDING', 'PROCESSING', 'SUCCESS', 'CANCELLED'].map(s => {
              const total = s ? orders.filter(o => o.orderStatus === s).length : 0;
              const newCount = s === 'SUCCESS' || s === 'CANCELLED'
                ? orders.filter(o => o.orderStatus === s && new Date(o.orderDate).getTime() > lastSeen).length
                : total;
              return (
                <button key={s} onClick={() => handleFilterClick(s)}
                  className={`relative ${statusFilter === s ? 'admin-filter-active' : 'admin-filter-inactive'}`}>
                  {s ? statusLabels[s] : 'Tất cả'}
                  {newCount > 0 && (
                    <span className="absolute -top-2 -right-2 inline-flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none shadow-sm ring-2 ring-white">
                      {newCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Thời gian</th>
                <th>Khách hàng</th>
                <th className="text-right">Tổng tiền</th>
                <th className="text-center">Thanh toán</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                    <td>
                      <span className="font-mono text-sm font-medium text-blue-600">#PK-{order.id}</span>
                    </td>
                    <td className="text-gray-400 text-xs">
                      {new Date(order.orderDate).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
                    </td>
                    <td>
                      <p className="text-sm font-medium text-gray-900">{order.fullName || order.user?.fullName || '—'}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="text-right font-semibold text-gray-900">
                      {order.totalPrice.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="text-center">
                      <span className={order.paymentStatus === 'PAID' ? 'admin-badge-success' : 'admin-badge-default'}>
                        <span className="admin-badge-dot" />
                        {paymentLabels[order.paymentStatus] || order.paymentStatus}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={statusBadge(order.orderStatus)}>
                        <span className="admin-badge-dot" />
                        {statusLabels[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === order.id ? null : order.id); }}
                          className="admin-btn-icon-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                          <svg className={`w-4 h-4 transition-transform ${expandedId === order.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {nextStatuses[order.orderStatus]?.map(action => (
                          <button key={action.status}
                            onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, action.status); }}
                            disabled={updatingId === order.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50 ${
                              action.status === 'CANCELLED'
                                ? 'text-red-600 bg-red-50 hover:bg-red-100'
                                : action.status === 'SUCCESS'
                                ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                : 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                            }`}>
                            {updatingId === order.id ? '...' : action.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="bg-gray-50/70 border-t border-gray-100 animate-fade-in">
                          <div className="p-5 space-y-5">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {[
                                { label: 'Số điện thoại', value: order.phoneNumber || '—' },
                                { label: 'Phương thức', value: order.paymentMethod || '—' },
                                { label: 'Ghi chú', value: order.note || '—' },
                                { label: 'Mã đơn hàng', value: `#${order.id}`, mono: true },
                              ].map((item, i) => (
                                <div key={i} className="bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
                                  <p className={`text-sm font-semibold text-gray-900 mt-1 ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-1 h-4 bg-blue-600 rounded-full" />
                                <p className="text-sm font-semibold text-gray-700">Sản phẩm trong đơn</p>
                              </div>
                              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-50">
                                {order.orderItems?.map((item, i) => (
                                  <div key={i} className="flex items-center gap-4 p-3.5">
                                    <img src={item.product?.img || '/assets/netflix-logo.png'}
                                      alt={item.product?.name} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">{item.product?.name}</p>
                                      <p className="text-xs text-gray-400 mt-0.5">
                                        {[item.duration, item.typeUser, `x${item.quantity}`].filter(Boolean).join(' · ')}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-900">{item.price?.toLocaleString('vi-VN')}đ</p>
                                      {item.keyCode && (
                                        <span className="admin-tag mt-1">
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                          </svg>
                                          {item.keyCode}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7}>
                    <div className="admin-empty">
                      <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <p className="admin-empty-title">Không có đơn hàng</p>
                      <p className="admin-empty-desc">{statusFilter ? 'Không có đơn hàng với trạng thái này' : 'Chưa có đơn hàng nào'}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>)}

      {activeTab === 'refunds' && (
        <div className="space-y-6">
          <div className="admin-page-header">
            <div className="admin-page-title">
              <div className="accent-dot" />
              <h1>Khiếu nại / Trả hàng</h1>
              <span className="admin-page-count">{refunds.length} yêu cầu</span>
            </div>
          </div>
          {refundsLoading ? (
            <div className="admin-card p-6">
              <div className="flex items-center gap-4">{[...Array(3)].map((_, i) => <div key={i} className="admin-skeleton h-5 w-full" />)}</div>
            </div>
          ) : refunds.length === 0 ? (
            <div className="admin-card">
              <div className="admin-empty">
                <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="admin-empty-title">Không có yêu cầu khiếu nại</p>
                <p className="admin-empty-desc">Khi có khách hàng khiếu nại hoặc yêu cầu trả hàng, yêu cầu sẽ hiển thị tại đây</p>
              </div>
            </div>
          ) : (
            <div className="admin-card">
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Lý do</th>
                      <th className="text-center">Trạng thái</th>
                      <th className="text-right">Ngày</th>
                      <th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((r: any) => (
                      <tr key={r.id}>
                        <td><span className="font-mono text-sm font-medium text-blue-600">#PK-{r.order?.id}</span></td>
                        <td>
                          <p className="text-sm font-medium text-gray-900">{r.user?.fullName || '—'}</p>
                          <p className="text-xs text-gray-400">{r.user?.email}</p>
                        </td>
                        <td className="max-w-[200px]">
                          <p className="text-sm text-gray-700 truncate" title={r.reason}>{r.reason}</p>
                          {r.adminNote && <p className="text-xs text-gray-400 mt-0.5">Phản hồi: {r.adminNote}</p>}
                        </td>
                        <td className="text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${refundStatusBadge(r.status)}`}>
                            {refundStatusLabel[r.status] || r.status}
                          </span>
                        </td>
                        <td className="text-right text-gray-500 text-xs">
                          {new Date(r.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
                        </td>
                        <td className="text-center">
                          {r.status === 'PENDING' ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button onClick={() => handleProcessRefund(r.id, 'APPROVED')} disabled={processingRefund === r.id}
                                className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50">
                                {processingRefund === r.id ? '...' : 'Duyệt'}
                              </button>
                              <button onClick={() => { setRejectModal({ id: r.id, sellerId: user?.id || 0 }); setRejectReason(''); }}
                                className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                                Từ chối
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Từ chối yêu cầu</h3>
            <p className="text-sm text-gray-500 mb-4">Nhập lý do từ chối</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              className="admin-input w-full min-h-[100px] resize-none" placeholder="Lý do từ chối..." />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setRejectModal(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition">Huỷ</button>
              <button onClick={async () => {
                if (rejectModal) {
                  await handleProcessRefund(rejectModal.id, 'REJECTED', rejectReason);
                  setRejectModal(null);
                }
              }} disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition disabled:opacity-50">
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessOrders;
