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

const ProcessOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
          <span className="admin-page-count">{orders.length} đơn</span>
        </div>
      </div>

      {orders.length === 0 ? (
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
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
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