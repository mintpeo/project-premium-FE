import React, { useState, useEffect } from 'react';

interface OrderItem {
  id: number;
  product: { id: number; name: string; img: string };
  quantity: number;
  typeUser: string;
  duration: string;
  keyCode: string;
  price: number;
}

interface OrderUser {
  id: number;
  email: string;
  fullName: string;
}

interface Order {
  id: number;
  user: OrderUser;
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

const ManageOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [lastSeen, setLastSeen] = useState<number>(() => {
    const saved = localStorage.getItem('orders_last_seen');
    return saved ? Number(saved) : Date.now();
  });

  const [clickRefund, setClickRefund] = useState(false);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [processingRefund, setProcessingRefund] = useState<number | null>(null);
  const [rejectModal, setRejectModal] = useState<{ id: number; sellerId: number } | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const [sendKeyAgainModal, setSendKeyAgainModal] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [emailRejected, setEmailRejected] = useState(false);

  console.log(refunds);

  useEffect(() => {
    fetchOrders();
    const onVisible = () => { if (!document.hidden) fetchOrders(); };
    const onOrderUpdate = () => fetchOrders();
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('order-update', onOrderUpdate);
    window.addEventListener('storage', (e) => { if (e.key === 'order_update') fetchOrders(); });
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('order-update', onOrderUpdate);
    };
  }, []);

  const handleFilterClick = (s: string) => {
    setStatusFilter(s);
    if (s === 'SUCCESS' || s === 'CANCELLED') {
      const now = Date.now();
      setLastSeen(now);
      localStorage.setItem('orders_last_seen', String(now));
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/orders');
      if (!res.ok) throw new Error('Không thể tải đơn hàng');
      setOrders(await res.json());
    } catch (e) {
      console.error("Error Orders Admin", e);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/order/confirm/${orderId}`, { method: 'PUT' });
      if (!res.ok) throw new Error('Xác nhận thất bại');
      await fetchOrders();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xác nhận'));
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Cập nhật thất bại');
      await fetchOrders();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật trạng thái'));
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

  const statusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'admin-badge-success';
      case 'PROCESSING': return 'admin-badge-warning';
      case 'PENDING': return 'admin-badge-default';
      case 'CANCELLED': return 'admin-badge-error';
      default: return 'admin-badge-default';
    }
  };

  useEffect(() => {
    fetchComplain();
  }, [clickRefund]);

  const handleProcessRefund = async (id: number, status: string, note?: string) => {
    setProcessingRefund(id);

    const change = {
      "complainId": id,
      "status": status,
      "rejected": note
    }

    try {
      const res = await fetch(`http://localhost:8080/api/complain/change`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(change)
      });
      if (!res.ok) throw new Error('Xử lý thất bại');
      await fetchComplain();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingRefund(null);
    }
  };

  const fetchComplain = async () => {
    const complainId = {
      sellerId: 0
    }

    try {
      const res = await fetch(`http://localhost:8080/api/complain/admin`, {
        method: 'get'
      });
      if (!res.ok) throw new Error('Không thể tải đơn khiếu nại');
      const data = await res.json();
      setRefunds(Array.isArray(data) ? data : []);
    } catch {
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  };

  const sendMailForUser = async () => {
    const send = {
      isRejected: emailRejected,
      email: emailInput,
      des: keyInput
    }

    try {
      const res = await fetch(`http://localhost:8080/api/complain/sendMailUser`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(send)
      });
    } catch (e) {
      console.log("Error Send Mail For User", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const changeEmail = () => {
      const cur = refunds.find(r => r.id === processingRefund);
      setEmailInput(cur?.email);
    }
    changeEmail();
  }, [processingRefund]);

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

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
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

  return (
    <div className="space-y-8">
        <div className="admin-page-header">
          <div className="admin-page-title">
            <div className="accent-dot" />
            <div className="flex items-center gap-2">
              <button onClick={() => setClickRefund(false)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${!clickRefund ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}`}>
                Đơn hàng
                <span className="ml-1 text-xs opacity-75">({filtered.length})</span>
              </button>
              <button onClick={() => setClickRefund(true)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${clickRefund ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200'}`}>
                Khiếu nại
                <span className="ml-1 text-xs opacity-75">({refunds.length})</span>
              </button>
            </div>
          </div>
          {!clickRefund && (
          <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 max-w-[200px] w-full">
            <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Tìm mã, tên, email..." value={searchText} onChange={e => setSearchText(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none" />
          </div>
          <a href="http://localhost:8080/api/admin/export/orders"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </a>
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
      )}
      </div>
      <div className="admin-card" style={clickRefund ? {display: "none"} : {display: "block"}}>
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
                        {order.orderStatus === 'PROCESSING' && (
                          <button onClick={(e) => { e.stopPropagation(); handleConfirm(order.id); }}
                            className="admin-btn-icon-sm text-green-600 hover:bg-green-50" title="Xác nhận">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        )}
                        <select
                          value=""
                          onChange={(e) => { e.stopPropagation(); if (e.target.value) handleUpdateStatus(order.id, e.target.value); }}
                          onClick={(e) => e.stopPropagation()}
                          className="admin-select text-xs py-1 px-2 max-w-[100px]"
                        >
                          <option value="">Cập nhật</option>
                          {order.orderStatus !== 'PENDING' && <option value="PENDING">{statusLabels.PENDING}</option>}
                          {order.orderStatus !== 'PROCESSING' && <option value="PROCESSING">{statusLabels.PROCESSING}</option>}
                          {order.orderStatus !== 'SUCCESS' && <option value="SUCCESS">{statusLabels.SUCCESS}</option>}
                          {order.orderStatus !== 'CANCELLED' && <option value="CANCELLED">{statusLabels.CANCELLED}</option>}
                        </select>
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

      <div>
        <div className="admin-card" style={clickRefund ? {display: "block"} : {display: "none"}}>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Lý do</th>
                <th>Mô tả chi tiết</th>
                <th>Phản hồi</th>
                <th>Seller</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-right">Ngày</th>
                <th className="text-center">Thao tác</th>
              </tr>
              </thead>
              <tbody>
              {refunds.sort((a, b) => b.id - a.id).map((r: any) => (
                  <tr key={r.id}>
                    <td><span className="font-mono text-sm font-medium text-blue-600">#PK-{r.orderId}</span></td>
                    <td>
                      <p className="text-sm font-medium text-gray-900">{r.userName || '—'}</p>
                      <p className="text-xs text-gray-400">{r.email}</p>
                    </td>
                    <td className="max-w-[180px]">
                      <p className="text-sm text-gray-700 truncate" title={r.reason}>{r.reason}</p>
                    </td>
                    <td className="max-w-[180px]">
                      <p className="text-sm text-gray-700 truncate" title={r.description}>{r.description || '—'}</p>
                    </td>
                    <td className="max-w-[180px]">
                      <p className={`text-sm truncate ${r.rejected ? 'text-red-600' : 'text-gray-400'}`} title={r.rejected}>
                        {r.rejected || '—'}
                      </p>
                    </td>
                    <td>
                      <p className="text-sm font-medium text-gray-900">{r.userSeller || '—'}</p>
                      <p className="text-xs text-gray-400">{r.emailSeller || ''}</p>
                    </td>
                    <td className="text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${refundStatusBadge(r.status)}`}>
                        {refundStatusLabel[r.status] || r.status}
                      </span>
                    </td>
                    <td className="text-right text-gray-500 text-xs whitespace-nowrap">
                      {new Date(r.date).toLocaleString('vi-VN', {
                        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="text-center">
                      {r.status === 'PENDING' && !r.emailSeller ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleProcessRefund(r.id, 'APPROVED')}
                                    disabled={processingRefund === r.id}
                                    className="px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition disabled:opacity-50">
                              {processingRefund === r.id ? '...' : 'Duyệt'}
                            </button>
                            <button onClick={() => { setRejectModal({id: r.id, sellerId: 0}); setRejectReason(''); }}
                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                              Từ chối
                            </button>
                          </div>
                      ) : r.status === 'APPROVED' && !r.emailSeller ? (
                          <button onClick={() => { setProcessingRefund(r.id); setEmailRejected(false); setSendKeyAgainModal(true); }}
                                  className="px-3 py-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition">
                            Gửi Key
                          </button>
                      ) : !r.emailSeller ? (
                          <button onClick={() => { setProcessingRefund(r.id); setEmailRejected(true); setSendKeyAgainModal(true); }}
                                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition">
                            Từ chối
                          </button>
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

        {/* Modal Send Key Again */}
        {sendKeyAgainModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSendKeyAgainModal(false)}>
              <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>

                <h3 className="text-lg font-bold text-gray-900 mb-1">Cung cấp thông tin tài khoản</h3>
                <p className="text-sm text-gray-500 mb-4">{emailRejected ? ("Vui lòng nhập Email và Lí do từ chối") : ("Vui lòng nhập Email và Key bàn giao sản phẩm")}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email người nhận <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition"
                        placeholder="Nhập email khách hàng..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{emailRejected ? ("Lí do từ chối") : ("Mã sản phẩm / Key")} <span className="text-red-500">*</span></label>
                    <textarea
                        value={keyInput}
                        onChange={e => setKeyInput(e.target.value)}
                        rows={3}
                        className="w-full px-3.5 py-2 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white transition resize-none"
                        placeholder={emailRejected ? ("Nhập lí do từ chối...") : ("Nhập mã key kích hoạt tài khoản...")}
                    />
                  </div>
                </div>

                {/* Hệ thống nút bấm */}
                <div className="flex gap-3 mt-6">
                  <button
                      onClick={() => {
                        setKeyInput("");
                        setSendKeyAgainModal(false);
                      }}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                  >
                    Huỷ
                  </button>
                  <button
                      onClick={() => {
                        sendMailForUser();
                        setKeyInput("");
                        setSendKeyAgainModal(false);
                      }}
                      // Chỉ sáng nút bấm khi người dùng đã nhập đủ cả Email và Key (bỏ trống khoảng trắng)
                      disabled={!keyInput.trim()}
                      className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Xác nhận gửi
                  </button>
                </div>

              </div>
            </div>
        )}

        {/* Modal Rejected */}
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
    </div>
  );
};

export default ManageOrders;