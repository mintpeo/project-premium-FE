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
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/admin/orders');
      if (!res.ok) throw new Error('Không thể tải đơn hàng');
      setOrders(await res.json());
    } catch {
      setOrders([]);
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

  const filtered = statusFilter ? orders.filter(o => o.orderStatus === statusFilter) : orders;

  const statusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'admin-badge-success';
      case 'PROCESSING': return 'admin-badge-info';
      case 'PENDING': return 'admin-badge-warning';
      case 'CANCELLED': return 'admin-badge-error';
      default: return 'admin-badge-default';
    }
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
            <h1>Quản lý đơn hàng</h1>
            <span className="admin-page-count">{filtered.length} đơn</span>
          </div>
          <div className="flex items-center gap-2">
          <a href="http://localhost:8080/api/admin/export/orders"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Xuất Excel
          </a>
          <div className="flex gap-1.5">
          {['', 'PENDING', 'PROCESSING', 'SUCCESS', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? 'admin-filter-active' : 'admin-filter-inactive'}>
              {s ? statusLabels[s] : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>
      </div>

      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày</th>
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
                      {new Date(order.orderDate).toLocaleDateString('vi-VN')}
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
                          {order.orderStatus !== 'PENDING' && <option value="PENDING">Chờ xác nhận</option>}
                          {order.orderStatus !== 'PROCESSING' && <option value="PROCESSING">Đang xử lý</option>}
                          {order.orderStatus !== 'SUCCESS' && <option value="SUCCESS">Hoàn thành</option>}
                          {order.orderStatus !== 'CANCELLED' && <option value="CANCELLED">Đã huỷ</option>}
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
    </div>
  );
};

export default ManageOrders;