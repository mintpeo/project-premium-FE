import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

const MOCK_SELLER_BREAKDOWN = [
  { sellerId: 1, sellerName: 'Nguyễn Văn A', sellerEmail: 'vana@gmail.com', totalPending: 2500000, totalApproved: 5000000, total: 7500000, earnings: [
    { id: 1, amount: 120000, status: 'APPROVED', orderId: 1001, productName: 'Game Account VIP', createdAt: '2026-06-25T10:30:00' },
    { id: 2, amount: 150000, status: 'PENDING', orderId: 1002, productName: 'Spotify Premium', createdAt: '2026-06-27T14:20:00' },
    { id: 3, amount: 130000, status: 'APPROVED', orderId: 1003, productName: 'Netflix 4K', createdAt: '2026-06-20T09:15:00' },
  ]},
  { sellerId: 2, sellerName: 'Trần Thị B', sellerEmail: 'thib@gmail.com', totalPending: 1800000, totalApproved: 3200000, total: 5000000, earnings: [
    { id: 4, amount: 200000, status: 'PENDING', orderId: 1004, productName: 'Canva Pro', createdAt: '2026-06-28T08:00:00' },
    { id: 5, amount: 180000, status: 'APPROVED', orderId: 1005, productName: 'YouTube Premium', createdAt: '2026-06-22T16:45:00' },
  ]},
  { sellerId: 3, sellerName: 'Phạm Văn C', sellerEmail: 'vanc@gmail.com', totalPending: 0, totalApproved: 8900000, total: 8900000, earnings: [
    { id: 6, amount: 300000, status: 'APPROVED', orderId: 1006, productName: 'Adobe Creative Cloud', createdAt: '2026-06-18T11:30:00' },
    { id: 7, amount: 250000, status: 'APPROVED', orderId: 1007, productName: 'Office 365', createdAt: '2026-06-15T13:00:00' },
  ]},
  { sellerId: 4, sellerName: 'Lê Thị D', sellerEmail: 'thid@gmail.com', totalPending: 4200000, totalApproved: 1500000, total: 5700000, earnings: [
    { id: 8, amount: 210000, status: 'PENDING', orderId: 1008, productName: 'VPN Pro', createdAt: '2026-06-29T07:30:00' },
  ]},
];

const MOCK_MONTHLY_REVENUE = [
  { date: '01/06', revenue: 2500000 }, { date: '03/06', revenue: 1800000 }, { date: '05/06', revenue: 3200000 },
  { date: '07/06', revenue: 1500000 }, { date: '09/06', revenue: 4200000 }, { date: '11/06', revenue: 2800000 },
  { date: '13/06', revenue: 3500000 }, { date: '15/06', revenue: 2100000 }, { date: '17/06', revenue: 3900000 },
  { date: '19/06', revenue: 1600000 }, { date: '21/06', revenue: 4500000 }, { date: '23/06', revenue: 3100000 },
  { date: '25/06', revenue: 2700000 }, { date: '27/06', revenue: 3800000 }, { date: '29/06', revenue: 2200000 },
];

interface RevenueDay { date: string; revenue: number }
interface CategoryRev { name: string; revenue: number }

const USE_MOCK = true;

const ManageRevenue = () => {
  const [period, setPeriod] = useState('30d');
  const [revenueData, setRevenueData] = useState<RevenueDay[]>(USE_MOCK ? MOCK_MONTHLY_REVENUE : []);
  const [categoryRevenue, setCategoryRevenue] = useState<CategoryRev[]>(USE_MOCK ? [
    { name: 'Game', revenue: 8500000 }, { name: 'Video', revenue: 6200000 },
    { name: 'Nhạc', revenue: 4500000 }, { name: 'Office', revenue: 3800000 },
    { name: 'Adobe', revenue: 2900000 },
  ] : []);
  const [totalRevenue, setTotalRevenue] = useState(USE_MOCK ? 506900 : 0);
  const [successOrders, setSuccessOrders] = useState(USE_MOCK ? 128 : 0);
  const [sellerEarnings, setSellerEarnings] = useState(USE_MOCK ? { totalPending: 8500000, totalApproved: 0, total: 8500000 } : { totalPending: 0, totalApproved: 0, total: 0 });
  const [sellerBreakdown, setSellerBreakdown] = useState<any[]>(USE_MOCK ? MOCK_SELLER_BREAKDOWN : []);
  const [expandedSellers, setExpandedSellers] = useState<Set<number>>(new Set());
  const [detailModal, setDetailModal] = useState<{ type: 'approved' | 'pending' | 'total'; label: string } | null>(null);
  const [loading, setLoading] = useState(!USE_MOCK);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [revRes, catRes, dashRes, earnRes, breakdownRes] = await Promise.all([
        fetch(`http://localhost:8080/api/admin/revenue?period=${period}`),
        fetch('http://localhost:8080/api/admin/revenue/by-category'),
        fetch('http://localhost:8080/api/admin/dashboard'),
        fetch('http://localhost:8080/api/admin/seller-earnings/summary'),
        fetch('http://localhost:8080/api/admin/seller-earnings/breakdown'),
      ]);

      if (revRes.ok) { const d = await revRes.json(); setRevenueData(Array.isArray(d) ? d : []); }
      if (catRes.ok) { const d = await catRes.json(); setCategoryRevenue(Array.isArray(d) ? d : []); }
      if (dashRes.ok) {
        const d = await dashRes.json();
        setTotalRevenue(d.totalRevenue || 0);
        setSuccessOrders(d.orderStatusCounts?.SUCCESS || 0);
      }
      if (earnRes.ok) { const d = await earnRes.json(); if (d) setSellerEarnings(d); }
      if (breakdownRes.ok) { const d = await breakdownRes.json(); setSellerBreakdown(Array.isArray(d) ? d : []); }
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/admin/revenue?period=${period}`);
        if (res.ok) { const d = await res.json(); setRevenueData(Array.isArray(d) ? d : []); }
      } catch {}
    };
    fetchRevenue();
  }, [period]);

  const totalInPeriod = revenueData.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý doanh thu</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="admin-card">
          <div className="p-5">
            <p className="admin-stat-label">Tổng doanh thu</p>
            <p className="admin-stat-value text-blue-600">{totalRevenue.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-5">
            <p className="admin-stat-label">Doanh thu kỳ này</p>
            <p className="admin-stat-value text-emerald-600">{totalInPeriod.toLocaleString('vi-VN')}đ</p>
          </div>
        </div>
        <div className="admin-card">
          <div className="p-5">
            <p className="admin-stat-label">Đơn thành công</p>
            <p className="admin-stat-value text-amber-600">{successOrders.toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Doanh thu theo thời gian</h3>
            <div className="flex gap-1.5">
              {[['7d', '7 ngày'], ['30d', '30 ngày'], ['90d', '90 ngày'], ['1y', '1 năm'], ['all', 'Tất cả']].map(([key, label]) => (
                <button key={key} onClick={() => setPeriod(key)}
                  className={period === key ? 'admin-filter-active' : 'admin-filter-inactive'}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {loading ? (
            <div className="admin-skeleton h-64 w-full" />
          ) : revenueData.length === 0 ? (
            <div className="admin-empty py-10"><p className="admin-empty-title">Chưa có dữ liệu</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  labelStyle={{ color: '#f59e0b', fontWeight: 600 }} />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu theo danh mục</h3>
            {categoryRevenue.length === 0 ? (
              <div className="admin-empty py-10"><p className="admin-empty-title">Chưa có dữ liệu</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={categoryRevenue} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value: number) => `${value.toLocaleString('vi-VN')}đ`} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Doanh thu theo danh mục</h3>
            {categoryRevenue.length === 0 ? (
              <div className="admin-empty py-10"><p className="admin-empty-title">Chưa có dữ liệu</p></div>
            ) : (
              <div className="space-y-3">
                {categoryRevenue.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{cat.revenue.toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bổ doanh thu</h3>
          {sellerEarnings.total === 0 && totalRevenue === 0 ? (
            <div className="admin-empty py-10"><p className="admin-empty-title">Chưa có dữ liệu</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <button onClick={() => setDetailModal({ type: 'total', label: 'Tổng doanh thu' })} className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-sm hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all text-left cursor-pointer">
                <p className="text-sm text-blue-100 mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</p>
              </button>
              <button onClick={() => setDetailModal({ type: 'approved', label: 'Đã trả seller' })} className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-sm hover:shadow-lg hover:from-amber-600 hover:to-amber-700 transition-all text-left cursor-pointer">
                <p className="text-sm text-amber-100 mb-1">Đã trả seller</p>
                <p className="text-2xl font-bold">{sellerEarnings.totalApproved.toLocaleString('vi-VN')}đ</p>
              </button>
              <button onClick={() => setDetailModal({ type: 'pending', label: 'Chờ thanh toán seller' })} className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-sm hover:shadow-lg hover:from-emerald-600 hover:to-emerald-700 transition-all text-left cursor-pointer">
                <p className="text-sm text-emerald-100 mb-1">Chờ thanh toán seller</p>
                <p className="text-2xl font-bold">{sellerEarnings.totalPending.toLocaleString('vi-VN')}đ</p>
              </button>
            </div>
          )}
        </div>
      </div>

      {detailModal && (
        <div className="admin-modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="admin-modal max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">{detailModal.label}</h3>
                </div>
                <button onClick={() => setDetailModal(null)} className="admin-btn-icon text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[420px] overflow-y-auto -mx-2 px-2 space-y-2">
                {sellerBreakdown
                  .filter(s => detailModal.type === 'total' ? s.total > 0 : detailModal.type === 'approved' ? s.totalApproved > 0 : s.totalPending > 0)
                  .length === 0 ? (
                  <div className="admin-empty py-10">
                    <svg className="w-14 h-14 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="admin-empty-title">Chưa có dữ liệu</p>
                    <p className="admin-empty-desc">Chưa có seller nào trong mục này</p>
                  </div>
                ) : (
                  sellerBreakdown
                    .filter(s => detailModal.type === 'total' ? s.total > 0 : detailModal.type === 'approved' ? s.totalApproved > 0 : s.totalPending > 0)
                    .map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{s.sellerName}</p>
                          <p className="text-xs text-gray-400">{s.sellerEmail}</p>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {(detailModal.type === 'total' ? s.total : detailModal.type === 'approved' ? s.totalApproved : s.totalPending).toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {sellerBreakdown.length > 0 && (
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Chi tiết trả cho seller</h3>
            <div className="overflow-x-auto">
              <table className="admin-table w-full">
                <thead>
                  <tr>
                    <th className="admin-th" style={{ width: 40 }} />
                    <th className="admin-th text-left">Seller</th>
                    <th className="admin-th text-left">Email</th>
                    <th className="admin-th text-right">Đã trả</th>
                    <th className="admin-th text-right">Chờ thanh toán</th>
                    <th className="admin-th text-right">Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerBreakdown.map((s: any, i: number) => (
                    <React.Fragment key={i}>
                      <tr
                        className="admin-tr cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          const next = new Set(expandedSellers);
                          if (next.has(s.sellerId)) next.delete(s.sellerId); else next.add(s.sellerId);
                          setExpandedSellers(next);
                        }}
                      >
                        <td className="admin-td">
                          {expandedSellers.has(s.sellerId) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>
                        <td className="admin-td font-medium text-gray-900">{s.sellerName}</td>
                        <td className="admin-td text-gray-500">{s.sellerEmail}</td>
                        <td className="admin-td text-right text-emerald-600 font-semibold">{s.totalApproved.toLocaleString('vi-VN')}đ</td>
                        <td className="admin-td text-right text-amber-600 font-semibold">{s.totalPending.toLocaleString('vi-VN')}đ</td>
                        <td className="admin-td text-right text-gray-900 font-bold">{s.total.toLocaleString('vi-VN')}đ</td>
                      </tr>
                      {expandedSellers.has(s.sellerId) && s.earnings?.length > 0 && (
                        <tr>
                          <td colSpan={6} className="p-0">
                            <div className="bg-gray-50 border-t border-b border-gray-100">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-2 px-6 text-gray-500 font-medium">Sản phẩm</th>
                                    <th className="text-left py-2 px-6 text-gray-500 font-medium">Mã đơn</th>
                                    <th className="text-right py-2 px-6 text-gray-500 font-medium">Số tiền</th>
                                    <th className="text-center py-2 px-6 text-gray-500 font-medium">Trạng thái</th>
                                    <th className="text-right py-2 px-6 text-gray-500 font-medium">Ngày</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {s.earnings.map((e: any, j: number) => (
                                    <tr key={j} className="border-b border-gray-100 hover:bg-gray-100/50 transition-colors">
                                      <td className="py-2 px-6 text-gray-800">{e.productName}</td>
                                      <td className="py-2 px-6 text-gray-500">#{e.orderId}</td>
                                      <td className="py-2 px-6 text-right font-medium text-gray-900">{e.amount.toLocaleString('vi-VN')}đ</td>
                                      <td className="py-2 px-6 text-center">
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${e.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                          {e.status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                                        </span>
                                      </td>
                                      <td className="py-2 px-6 text-right text-gray-500">{new Date(e.createdAt).toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRevenue;
