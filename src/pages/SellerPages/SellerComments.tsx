import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Reply, ThumbsUp, Search } from 'lucide-react';

interface ProductComment {
  id: number;
  content: string;
  rating: number;
  user: { id: number; email: string };
  product: { id: number; name: string; img: string };
  parentId: number | null;
  approved: boolean;
  createdAt: string;
  replies: ProductComment[];
}

const SellerComments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);

  useEffect(() => {
    if (user) fetchComments();
  }, [user]);

  const fetchComments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/comments/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleReply = async (parentId: number) => {
    const content = replyText[parentId]?.trim();
    if (!content) return;
    try {
      const res = await fetch('http://localhost:8080/api/seller/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, content, sellerId: user!.id }),
      });
      if (!res.ok) throw new Error('Gửi phản hồi thất bại');
      setReplyText(prev => ({ ...prev, [parentId]: '' }));
      setReplyingId(null);
      await fetchComments();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Đánh giá & Bình luận</h1>
        </div>
        <div className="admin-card"><div className="admin-loading">{[...Array(3)].map((_, i) => <div key={i} className="admin-loading-row"><div className="admin-skeleton h-4 w-48" /><div className="admin-skeleton h-4 w-24" /></div>)}</div></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Đánh giá & Bình luận</h1>
          <span className="admin-page-count">{comments.length} đánh giá</span>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="admin-card">
          <div className="admin-empty">
            <MessageSquare className="admin-empty-icon" />
            <p className="admin-empty-title">Chưa có đánh giá nào</p>
            <p className="admin-empty-desc">Các đánh giá từ khách hàng sẽ xuất hiện tại đây</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment.id} className="admin-card">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {comment.user?.email?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">{comment.user?.email || 'Ẩn danh'}</span>
                    <span className="text-yellow-500 text-sm">{renderStars(comment.rating)}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{comment.content}</p>
                  <div className="flex items-center gap-2 mb-1">
                    {comment.product && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                        SP: {comment.product.name}
                      </span>
                    )}
                    {!comment.approved && (
                      <span className="admin-badge-warning"><span className="admin-badge-dot" />Chờ duyệt</span>
                    )}
                  </div>

                  {replyingId === comment.id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        value={replyText[comment.id] || ''}
                        onChange={e => setReplyText(p => ({ ...p, [comment.id]: e.target.value }))}
                        placeholder="Nhập phản hồi..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:border-blue-500 outline-none"
                        onKeyDown={e => e.key === 'Enter' && handleReply(comment.id)}
                      />
                      <button onClick={() => handleReply(comment.id)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">Gửi</button>
                      <button onClick={() => setReplyingId(null)} className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">Huỷ</button>
                    </div>
                  ) : (
                    <button onClick={() => setReplyingId(comment.id)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition mt-2">
                      <Reply size={14} /> Phản hồi
                    </button>
                  )}

                  {comment.replies?.length > 0 && (
                    <div className="mt-3 ml-6 pl-4 border-l-2 border-blue-100 space-y-3">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">S</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-xs">Seller</span>
                              <span className="text-[10px] text-gray-400">{new Date(reply.createdAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerComments;
