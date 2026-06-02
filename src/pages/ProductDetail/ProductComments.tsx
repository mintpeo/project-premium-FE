import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Reply, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CommentReply {
  id: number;
  userId: number;
  fullName: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: number;
  productId: number;
  userId: number;
  fullName: string;
  content: string;
  parentId: number | null;
  createdAt: string;
  replies: CommentReply[];
}

const ProductComments = ({ productId }: { productId: number }) => {
  const { user, isLoggedIn } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newContent, setNewContent] = useState('');
  const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:8080/api/comment/${productId}`)
      .then(r => r.json())
      .then(data => setComments(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [productId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    if (!isLoggedIn) { window.location.href = '/auth'; return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user!.id, content: newContent.trim() }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments(prev => [created, ...prev]);
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
    if (!isLoggedIn) { window.location.href = '/auth'; return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user!.id, content: replyContent.trim(), parentId: replyTo.id }),
      });
      if (res.ok) {
        const created = await res.json();
        setComments(prev =>
          prev.map(c => c.id === replyTo.id ? { ...c, replies: [...(c.replies || []), created] } : c)
        );
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col mt-4 mb-10">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase flex items-center gap-2">
        <MessageSquare size={20} /> Bình luận ({comments.length})
      </h2>

      <form onSubmit={handlePostComment} className="mb-8">
        <textarea
          value={newContent}
          onChange={e => { setNewContent(e.target.value); setError(''); }}
          placeholder={isLoggedIn ? 'Nhập bình luận của bạn...' : 'Vui lòng đăng nhập để bình luận'}
          rows={3}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-blue-400 resize-none"
          disabled={!isLoggedIn}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={sending || !isLoggedIn || !newContent.trim()}
            className="flex items-center gap-2 bg-[#1e90ff] hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-xl transition text-sm"
          >
            {sending ? 'Đang gửi...' : <><Send size={15} /> Gửi bình luận</>}
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-100 pb-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0">
                  {comment.fullName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-[#1e293b] text-sm">{comment.fullName}</span>
                    <span className="text-[11px] text-gray-400">{comment.createdAt}</span>
                  </div>
                  <p className="text-[14px] text-[#334155] leading-relaxed whitespace-pre-line">{comment.content}</p>
                  <button
                    onClick={() => {
                      if (!isLoggedIn) { window.location.href = '/auth'; return; }
                      setReplyTo(replyTo?.id === comment.id ? null : { id: comment.id, name: comment.fullName });
                    }}
                    className="flex items-center gap-1 text-blue-500 hover:text-blue-700 text-xs font-medium mt-2 transition"
                  >
                    <Reply size={12} /> Trả lời
                  </button>

                  {replyTo?.id === comment.id && (
                    <form onSubmit={handleReply} className="mt-3 ml-4">
                      <textarea
                        value={replyContent}
                        onChange={e => setReplyContent(e.target.value)}
                        placeholder={`Trả lời ${replyTo.name}...`}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:border-blue-400 resize-none"
                      />
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => { setReplyTo(null); setReplyContent(''); }}
                          className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-xs px-3 py-1.5 border border-gray-300 rounded-lg transition"
                        >
                          <X size={12} /> Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={sending || !replyContent.trim()}
                          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
                        >
                          {sending ? 'Đang gửi...' : <><Reply size={12} /> Trả lời</>}
                        </button>
                      </div>
                    </form>
                  )}

                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-100 space-y-4">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center font-bold text-white text-[11px] shrink-0">
                            {reply.fullName?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-[#1e293b] text-[13px]">{reply.fullName}</span>
                              <span className="text-[11px] text-gray-400">{reply.createdAt}</span>
                            </div>
                            <p className="text-[13px] text-[#334155] leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductComments;
