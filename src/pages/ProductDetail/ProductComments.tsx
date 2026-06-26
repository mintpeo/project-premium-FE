import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Comment {
  id: number;
  productId: number;
  userId: number;
  fullName: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  replies?: Comment[];
}

const ProductComments = ({ productId, sellerId }: { productId: number, sellerId?: number }) => {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());

  const toggleReplies = (commentId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  useEffect(() => {
    if (!productId) return;
    fetchComments();
  }, [productId]);

  const fetchComments = () => {
    fetch(`http://localhost:8080/api/comment/${productId}`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    if (!isLoggedIn) { 
        setShowAuthModal(true); 
        return; 
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user!.id, content: newContent.trim() }),
      });
      if (res.ok) {
        fetchComments();
        setNewContent('');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối server.');
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !replyTo) return;
    if (!isLoggedIn) { 
        setShowAuthModal(true); 
        return; 
    }
    setSending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user!.id, content: replyContent.trim(), parentId: replyTo.id }),
      });
      if (res.ok) {
        fetchComments();
        setReplyTo(null);
        setReplyContent('');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối server.');
    } finally {
      setSending(false);
    }
  };

  // Tính tổng số bình luận (kể cả các phản hồi lồng nhau)
  const countComments = (nodes: Comment[]): number => {
    return nodes.reduce((acc, node) => acc + 1 + countComments(node.replies || []), 0);
  };
  const totalComments = countComments(comments);

  const renderCommentNode = (comment: Comment, level = 0) => {
    return (
      <div key={comment.id} className={`mt-4 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-blue-100' : 'pb-5 border-b border-gray-100 last:border-0'}`}>
        <div className="flex items-start gap-3">
          <div className={`rounded-full bg-blue-500 flex items-center justify-center font-bold text-white shrink-0 ${level === 0 ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-[11px]'}`}>
            {comment.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-bold text-[#1e293b] ${level === 0 ? 'text-sm' : 'text-[13px]'}`}>{comment.fullName}</span>
              {comment.userId === sellerId && (
                <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Người bán</span>
              )}
              <span className="text-[11px] text-gray-400">{comment.createdAt}</span>
            </div>
            <p className={`text-[#334155] leading-relaxed whitespace-pre-line ${level === 0 ? 'text-[14px]' : 'text-[13px]'}`}>{comment.content}</p>
            
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setShowAuthModal(true);
                } else {
                  setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id, name: comment.fullName });
                }
              }}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium mt-2 transition"
            >
              <Reply size={12} /> Trả lời
            </button>

            {replyTo?.id === comment.id && (
              <form onSubmit={handleReply} className="mt-3 ml-2">
                <textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder={`Trả lời ${replyTo.name}...`}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-blue-400 resize-none shadow-sm"
                  autoFocus
                />
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => { setReplyTo(null); setReplyContent(''); }}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5 border border-gray-300 rounded-lg transition hover:bg-gray-50"
                  >
                    <X size={12} /> Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={sending || !replyContent.trim()}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-sm"
                  >
                    {sending ? 'Đang gửi...' : <><Reply size={12} /> Trả lời</>}
                  </button>
                </div>
              </form>
            )}

            {/* Đệ quy hiển thị các phản hồi con */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {!expandedComments.has(comment.id) ? (
                  <button 
                    onClick={() => toggleReplies(comment.id)}
                    className="flex items-center gap-2 text-[13px] font-medium text-blue-600 hover:text-blue-800 transition py-1"
                  >
                    <div className="w-6 border-b border-blue-300"></div>
                    Xem thêm {countComments(comment.replies)} phản hồi
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-2 text-[13px] font-medium text-gray-500 hover:text-gray-700 transition mb-3 py-1"
                    >
                      <div className="w-6 border-b border-gray-300"></div>
                      Ẩn phản hồi
                    </button>
                    {comment.replies.map(reply => renderCommentNode(reply, level + 1))}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col mt-4 mb-10">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase flex items-center gap-2">
        <MessageSquare size={20} /> Bình luận ({totalComments})
      </h2>

      <form onSubmit={handlePostComment} className="mb-8">
        <textarea
          value={newContent}
          onChange={e => { setNewContent(e.target.value); setError(''); }}
          onClick={() => { if (!isLoggedIn) setShowAuthModal(true); }}
          placeholder={isLoggedIn ? 'Nhập bình luận của bạn...' : 'Vui lòng đăng nhập để bình luận'}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-blue-400 resize-none"
          readOnly={!isLoggedIn}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={sending || (!isLoggedIn ? false : !newContent.trim())}
            className="flex items-center gap-2 bg-[#1e90ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl transition text-sm"
          >
            {sending ? 'Đang gửi...' : <><Send size={15} /> Gửi bình luận</>}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-2">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map(comment => renderCommentNode(comment, 0))
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Đăng nhập để tiếp tục</h3>
              <p className="text-gray-500 mb-6 text-sm">Vui lòng đăng nhập hoặc đăng ký tài khoản để có thể tham gia bình luận về sản phẩm này.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
                >
                  Hủy bỏ
                </button>
                <button 
                  onClick={() => window.location.href = '/auth'}
                  className="flex-1 px-4 py-2.5 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductComments;
