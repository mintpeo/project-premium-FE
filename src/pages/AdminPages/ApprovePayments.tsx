import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

interface EarningItem {
  id: number;
  amount: number;
  orderId: number;
  productName: string;
  createdAt: string;
}

interface SellerGroup {
  sellerId: number;
  sellerName: string;
  sellerEmail: string;
  totalPending: number;
  earnings: EarningItem[];
}

const ApprovePayments = () => {
  const { user } = useAuth();
  const [sellers, setSellers] = useState<SellerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [approvingAll, setApprovingAll] = useState<number | null>(null);

  const fetchPending = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch('http://localhost:8080/api/admin/seller-pending-earnings');
      if (res.ok) {
        setSellers(await res.json());
      }
    } catch (err) {
      console.error('Lỗi tải danh sách chờ duyệt:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const approveOne = async (earningId: number) => {
    setApprovingId(earningId);
    try {
      await fetch(`http://localhost:8080/api/admin/seller-earnings/${earningId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user!.id }),
      });
      await fetchPending();
    } catch (err) {
      console.error('Lỗi duyệt:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const approveAll = async (sellerId: number) => {
    setApprovingAll(sellerId);
    try {
      await fetch(`http://localhost:8080/api/admin/seller-earnings/approve-all/${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: user!.id }),
      });
      await fetchPending();
    } catch (err) {
      console.error('Lỗi duyệt tất cả:', err);
    } finally {
      setApprovingAll(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="admin-page-header">
          <div className="admin-page-title">
            <div className="accent-dot" />
            <h1>Duyệt thanh toán</h1>
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="admin-card"><div className="p-6 space-y-3"><div className="admin-skeleton h-5 w-48" /><div className="admin-skeleton h-4 w-32" /></div></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Duyệt thanh toán</h1>
        </div>
      </div>

      {sellers.length === 0 ? (
        <div className="admin-card">
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Không có khoản thanh toán nào chờ duyệt</p>
            <p className="text-gray-400 text-sm mt-1">Tất cả đã được xử lý</p>
          </div>
        </div>
      ) : (
        sellers.map((seller) => (
          <div key={seller.sellerId} className="admin-card overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{seller.sellerName}</h3>
                  <p className="text-sm text-gray-500">{seller.sellerEmail}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tổng chờ duyệt</p>
                    <p className="text-lg font-bold text-amber-600">{seller.totalPending.toLocaleString('vi-VN')}đ</p>
                  </div>
                  <button
                    onClick={() => approveAll(seller.sellerId)}
                    disabled={approvingAll === seller.sellerId}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50 text-sm font-medium"
                  >
                    {approvingAll === seller.sellerId ? 'Đang duyệt...' : 'Duyệt tất cả'}
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Sản phẩm</th>
                      <th className="text-left py-3 px-2 text-gray-500 font-medium">Mã đơn</th>
                      <th className="text-right py-3 px-2 text-gray-500 font-medium">Số tiền</th>
                      <th className="text-right py-3 px-2 text-gray-500 font-medium">Ngày tạo</th>
                      <th className="text-right py-3 px-2 text-gray-500 font-medium">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seller.earnings.map((earning) => (
                      <tr key={earning.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-2 text-gray-800">{earning.productName}</td>
                        <td className="py-3 px-2 text-gray-500">#{earning.orderId}</td>
                        <td className="py-3 px-2 text-right font-medium text-gray-900">{earning.amount.toLocaleString('vi-VN')}đ</td>
                        <td className="py-3 px-2 text-right text-gray-500">{new Date(earning.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => approveOne(earning.id)}
                            disabled={approvingId === earning.id}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 text-xs font-medium"
                          >
                            {approvingId === earning.id ? '...' : 'Duyệt'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovePayments;
