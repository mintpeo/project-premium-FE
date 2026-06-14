import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardBody, CardTitle } from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const statusLabels: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  PROCESSING: 'Đang xử lý',
  SUCCESS: 'Hoàn thành',
  CANCELLED: 'Đã huỷ',
};

const periodLabels: Record<string, string> = {
  '7d': '7 ngày',
  '30d': '30 ngày',
  '90d': '90 ngày',
  '1y': '1 năm',
  'all': 'Tất cả',
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    orderStatusCounts: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<{ date: string; revenue: number }[]>([]);
  const [revenuePeriod, setRevenuePeriod] = useState('30d');
  const [revenueLoading, setRevenueLoading] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8080/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') setStats(data);
      })
      .catch(err => console.error('Lỗi tải dashboard:', err))
      .finally(() => setLoading(false));
  }, []);

  const fetchRevenue = useCallback(async (period: string) => {
    setRevenueLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/revenue?period=${period}`);
      if (res.ok) {
        const data = await res.json();
        setRevenueData(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Lỗi tải doanh thu:', err);
    } finally {
      setRevenueLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenue(revenuePeriod);
  }, [revenuePeriod, fetchRevenue]);

  const orderStatusData = Object.entries(stats.orderStatusCounts)
    .filter(([_, count]) => count > 0)
    .map(([key, count]) => ({ name: statusLabels[key] || key, value: count }));

  const barChartData = [
    { name: 'Tổng đơn', value: stats.totalOrders },
    { name: 'Hoàn thành', value: stats.orderStatusCounts['SUCCESS'] || 0 },
    { name: 'Đang xử lý', value: stats.orderStatusCounts['PROCESSING'] || 0 },
    { name: 'Chờ XN', value: stats.orderStatusCounts['PENDING'] || 0 },
  ];

  const totalRevenueInPeriod = revenueData.reduce((sum, d) => sum + d.revenue, 0);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="admin-card">
              <div className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="admin-card"><div className="p-6"><div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" /></div></div>
          <div className="admin-card"><div className="p-6"><div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" /></div></div>
        </div>
        <div className="admin-card"><div className="p-6"><div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" /></div></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ), gradient: 'from-blue-600 to-blue-500', shadow: 'shadow-blue-500/20' },
    { label: 'Tổng sản phẩm', value: stats.totalProducts, icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ), gradient: 'from-emerald-600 to-emerald-500', shadow: 'shadow-emerald-500/20' },
    { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ), gradient: 'from-amber-600 to-amber-500', shadow: 'shadow-amber-500/20' },
    { label: 'Doanh thu', value: `${stats.totalRevenue.toLocaleString('vi-VN')}đ`, icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), gradient: 'from-violet-600 to-violet-500', shadow: 'shadow-violet-500/20' },
  ];

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Dashboard</h1>
          <span className="admin-page-count">{stats.totalOrders} đơn hàng</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => (
          <div key={i} className="admin-card group cursor-default hover:shadow-md transition-all duration-300">
            <div className="p-6 flex items-center gap-4">
              <div className={`admin-stat-icon bg-gradient-to-br ${s.gradient} ${s.shadow}`}>
                {s.icon}
              </div>
              <div>
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-gray-900">Thống kê đơn hàng</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#9ca3af' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#9ca3af' }} />
                  <Tooltip cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '13px' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-gray-900">Trạng thái đơn hàng</h3>
            </div>
            <div className="h-72 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData.length > 0 ? orderStatusData : [{ name: 'Chưa có dữ liệu', value: 1 }]}
                    cx="50%" cy="50%"
                    innerRadius={80} outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(orderStatusData.length > 0 ? orderStatusData : [{ name: 'Chưa có dữ liệu', value: 1 }])
                      .map((_, index) => (
                        <Cell key={index} fill={orderStatusData.length > 0 ? COLORS[index % COLORS.length] : '#e5e7eb'} stroke="transparent" />
                      ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {orderStatusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-gray-500">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-blue-600 rounded-full" />
              <h3 className="text-base font-semibold text-gray-900">Biểu đồ doanh thu</h3>
              {!revenueLoading && revenueData.length > 0 && (
                <span className="text-sm text-gray-400 font-medium">
                  Tổng: <span className="text-emerald-600 font-semibold">{totalRevenueInPeriod.toLocaleString('vi-VN')}đ</span>
                </span>
              )}
            </div>
            <div className="flex gap-1.5">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button key={key} onClick={() => setRevenuePeriod(key)}
                  className={revenuePeriod === key ? 'admin-filter-active' : 'admin-filter-inactive'}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-72">
            {revenueLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-400">
                  <span className="loading loading-spinner loading-sm" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              </div>
            ) : revenueData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Chưa có dữ liệu doanh thu
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.4} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#9ca3af' }} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} fontSize={11} tick={{ fill: '#9ca3af' }}
                    tickFormatter={(v: number) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: '13px' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#revenueGradient)" dot={false} activeDot={{ r: 4, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;