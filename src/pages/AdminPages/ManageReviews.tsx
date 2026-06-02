import React, { useState, useEffect } from 'react';

interface ReviewUser {
  id: number;
  email: string;
  fullName: string;
}

interface Review {
  id: number;
  productId: number;
  user: ReviewUser;
  stars: number;
  content: string;
  approved: boolean;
  createdAt: string;
}

const ManageReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/reviews/pending');
      if (!res.ok) throw new Error('Không thể tải danh sách đánh giá');
      setReviews(await res.json());
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/reviews/${id}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error('Duyệt thất bại');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể duyệt'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá đánh giá này?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoá thất bại');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xoá'));
    }
  };

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < stars ? 'text-amber-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Duyệt đánh giá</h1>
        </div>
        <div className="admin-card">
          <div className="admin-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="admin-loading-row">
                <div className="admin-skeleton h-4 w-48" />
                <div className="admin-skeleton h-3 w-64" />
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
          <h1>Duyệt đánh giá</h1>
          <span className="admin-page-count">{reviews.length} đánh giá chờ duyệt</span>
        </div>
      </div>

      {error ? (
        <div className="admin-card">
          <div className="p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="admin-empty-title">Không có đánh giá chờ duyệt</p>
            <p className="admin-empty-desc">Tất cả đánh giá đã được duyệt</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review.id} className="admin-card">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                      {review.user?.fullName?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{review.user?.fullName || '—'}</p>
                        <span className="text-xs text-gray-400">{review.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        {renderStars(review.stars)}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Mã sản phẩm: #{review.productId} · {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleApprove(review.id)}
                      className="admin-btn-primary text-sm px-4 py-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Duyệt
                    </button>
                    <button onClick={() => handleDelete(review.id)}
                      className="admin-btn-ghost text-sm px-4 py-2 text-red-600 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Xoá
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageReviews;