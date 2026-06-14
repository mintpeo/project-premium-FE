import React, { useState, useEffect } from 'react';

interface CommentUser {
  id: number;
  email: string;
  fullName: string;
}

interface Comment {
  id: number;
  productId: number;
  user: CommentUser;
  content: string;
  parentId: number | null;
  approved: boolean;
  createdAt: string;
}

const ManageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const fetchPendingComments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/comments/pending');
      if (!res.ok) throw new Error('Không thể tải danh sách bình luận');
      setComments(await res.json());
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/comments/${id}/approve`, { method: 'PUT' });
      if (!res.ok) throw new Error('Duyệt thất bại');
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể duyệt'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xoá bình luận này?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/admin/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xoá thất bại');
      setComments(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể xoá'));
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Duyệt bình luận</h1>
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
          <h1>Duyệt bình luận</h1>
          <span className="admin-page-count">{comments.length} bình luận chờ duyệt</span>
        </div>
      </div>

      {error ? (
        <div className="admin-card">
          <div className="p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <svg className="admin-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="admin-empty-title">Không có bình luận chờ duyệt</p>
            <p className="admin-empty-desc">Tất cả bình luận đã được duyệt</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="admin-card">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                      {comment.user?.fullName?.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-gray-900">{comment.user?.fullName || '—'}</p>
                        <span className="text-xs text-gray-400">{comment.user?.email}</span>
                        {comment.parentId && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Trả lời</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{comment.content}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Mã sản phẩm: #{comment.productId} · {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleApprove(comment.id)}
                      className="admin-btn-primary text-sm px-4 py-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Duyệt
                    </button>
                    <button onClick={() => handleDelete(comment.id)}
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

export default ManageComments;
