import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
  id: number;
  product: { id: number; name: string; img: string };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  fullName: string;
  phoneNumber: string;
  orderStatus: string;
  orderDate: string;
  totalPrice: number;
  orderItems: OrderItem[];
}

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SUCCESS: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
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
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

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

  const statusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'admin-badge-success';
      case 'PROCESSING': return 'admin-badge-info';
      case 'PENDING': return 'admin-badge-warning';
      case 'CANCELLED': return 'admin-badge-error';
      default: return 'admin-badge-default';
    }
  };

  const filtered = statusFilter ? orders.filter(o => o.orderStatus === statusFilter) : orders;

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

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Xử lý đơn hàng</h1>
          <span className="admin-page-count">{filtered.length} đơn</span>
        </div>
        <div className="flex gap-1.5">
          {['', 'PENDING', 'PROCESSING', 'SUCCESS', 'CANCELLED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={statusFilter === s ? 'admin-filter-active' : 'admin-filter-inactive'}>
              {s ? statusLabels[s] : 'Tất cả'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="admin-empty-title">Chưa có đơn hàng nào</p>
            <p className="admin-empty-desc">Các đơn hàng sẽ xuất hiện tại đây</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Ngày</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th className="text-right">Tổng tiền</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => (
                  <tr key={order.id}>
                    <td>
                      <span className="font-mono text-sm font-medium text-blue-600">#PK-{order.id}</span>
                    </td>
                    <td className="text-xs text-gray-400">
                      {new Date(order.orderDate).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="text-sm font-medium text-gray-900">{order.fullName || '—'}</td>
                    <td className="text-sm text-gray-500">{order.phoneNumber || '—'}</td>
                    <td className="text-right font-semibold text-gray-900">
                      {order.totalPrice.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="text-center">
                      <span className={statusBadge(order.orderStatus)}>
                        <span className="admin-badge-dot" />
                        {statusLabels[order.orderStatus] || order.orderStatus}
                      </span>
                    </td>
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {nextStatuses[order.orderStatus]?.map(action => (
                          <button key={action.status}
                            onClick={() => handleUpdateStatus(order.id, action.status)}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessOrders;
