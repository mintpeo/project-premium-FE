import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const PersonalRevenue = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0, successOrders: 0 });
  const [balance, setBalance] = useState({ pendingAmount: 0, availableAmount: 0, totalEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resSuccess, resPending, resCancelled, resBalance] = await Promise.all([
        fetch(`http://localhost:8080/api/order/history?userId=${user!.id}&status=SUCCESS`),
        fetch(`http://localhost:8080/api/order/history?userId=${user!.id}&status=PENDING`),
        fetch(`http://localhost:8080/api/order/history?userId=${user!.id}&status=CANCELLED`),
        fetch(`http://localhost:8080/api/seller/balance/${user!.id}`),
      ]);

      const successOrders = resSuccess.ok ? await resSuccess.json() : [];
      const pendingOrders = resPending.ok ? await resPending.json() : [];
      const cancelledOrders = resCancelled.ok ? await resCancelled.json() : [];

      const totalOrders = (Array.isArray(successOrders) ? successOrders.length : 0)
        + (Array.isArray(pendingOrders) ? pendingOrders.length : 0)
        + (Array.isArray(cancelledOrders) ? cancelledOrders.length : 0);

      const totalSpent = Array.isArray(successOrders)
        ? successOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0)
        : 0;

      setStats({ totalOrders, totalSpent, successOrders: Array.isArray(successOrders) ? successOrders.length : 0 });

      if (resBalance.ok) {
        setBalance(await resBalance.json());
      }
    } catch (err) {
      console.error('Lỗi tải doanh thu:', err);
    } finally {
      setLoading(false);
    }
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
            <div key={i} className="admin-card">
              <div className="p-6 space-y-3">
                <div className="admin-skeleton h-4 w-24" />
                <div className="admin-skeleton h-8 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Tổng đơn hàng',
      value: stats.totalOrders,
      gradient: 'from-blue-600 to-blue-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Hoàn thành',
      value: stats.successOrders,
      gradient: 'from-emerald-600 to-emerald-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Chờ duyệt',
      value: `${balance.pendingAmount.toLocaleString('vi-VN')}đ`,
      gradient: 'from-amber-600 to-amber-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Đã nhận',
      value: `${balance.availableAmount.toLocaleString('vi-VN')}đ`,
      gradient: 'from-emerald-600 to-emerald-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Tổng thu nhập',
      value: `${balance.totalEarned.toLocaleString('vi-VN')}đ`,
      gradient: 'from-violet-600 to-violet-500',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Doanh thu cá nhân</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="admin-card overflow-hidden group hover:shadow-md transition-all duration-300">
            <div className="p-6 relative">
              <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full bg-gradient-to-br ${card.gradient} opacity-10`} />
              <div className="flex items-center gap-4 relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-0.5 truncate">{card.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalRevenue;