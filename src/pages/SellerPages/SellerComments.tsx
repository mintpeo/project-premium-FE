import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Reply, Star, MessageCircle, ChevronDown, ChevronUp, Package } from 'lucide-react';

interface Review {
  id: number;
  content: string;
  rating: number;
  user: { id: number; email: string };
  productId: number;
  approved: boolean;
  createdAt: string;
  isRead: boolean;
}

interface Comment {
  id: number;
  content: string;
  user: { id: number; email: string };
  productId: number;
  parentId: number | null;
  approved: boolean;
  createdAt: string;
  isRead: boolean;
  replies?: Comment[];
}

interface Product {
  id: number;
  name: string;
  img: string;
}

const SellerComments = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [expandedProductIds, setExpandedProductIds] = useState<Set<number>>(new Set());
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const [readProductIds, setReadProductIds] = useState<Set<number>>(new Set());

  const toggleReplies = (commentId: number) => {
    setExpandedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
    // Remove "Mới" badge from the parent and its direct replies
    setComments(prev => prev.map(c => 
      c.id === commentId || c.parentId === commentId ? { ...c, isRead: true } : c
    ));
  };

  const countComments = (nodes: Comment[]): number => {
    return nodes.reduce((acc, node) => acc + 1 + countComments(node.replies || []), 0);
  };
  
  const countUnread = (nodes: Comment[]): number => {
    return nodes.reduce((acc, node) => acc + (node.isRead ? 0 : 1) + countUnread(node.replies || []), 0);
  };

  useEffect(() => {
    if (user) {
      fetchProducts();
      if (activeTab === 'reviews') {
        fetchReviews();
      } else {
        fetchComments();
      }
    }
  }, [user, activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/seller/products/${user!.id}`);
      if (res.ok) {
        const data: Product[] = await res.json();
        const productMap = data.reduce((acc, p) => ({ ...acc, [p.id]: p }), {} as Record<number, Product>);
        setProducts(productMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/reviews/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/seller/comments/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (productId: number, type: 'review' | 'comment') => {
    try {
      const url = `http://localhost:8080/api/seller/${type}s/read/${productId}`;
      await fetch(url, { method: 'PUT' });
      // Remove setComments/setReviews so the "Mới" badge stays visible until refresh
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async (parentId: number, productId: number) => {
    const content = replyText[parentId]?.trim();
    if (!content) return;
    try {
      const res = await fetch('http://localhost:8080/api/seller/comments/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parentId, productId, content, userId: user!.id }),
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

  const toggleProduct = (productId: number, unreadCount: number, type: 'review' | 'comment') => {
    const isExpanded = expandedProductIds.has(productId);
    if (!isExpanded && unreadCount > 0) {
      markAsRead(productId, type);
      setReadProductIds(prev => new Set(prev).add(productId));
    }
    setExpandedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  // Group by product
  const groupedReviews = reviews.reduce((acc, review) => {
    if (!acc[review.productId]) acc[review.productId] = [];
    acc[review.productId].push(review);
    return acc;
  }, {} as Record<number, Review[]>);

  const groupedCommentsRaw = comments.reduce((acc, comment) => {
    if (!acc[comment.productId]) acc[comment.productId] = [];
    acc[comment.productId].push(comment);
    return acc;
  }, {} as Record<number, Comment[]>);

  const groupedComments: Record<number, Comment[]> = {};
  
  // Build N-level tree for each product
  Object.keys(groupedCommentsRaw).forEach(pidStr => {
    const pid = Number(pidStr);
    const productComments = groupedCommentsRaw[pid];
    
    const map = new Map<number, Comment>();
    productComments.forEach(c => map.set(c.id, { ...c, replies: [] }));
    
    const roots: Comment[] = [];
    productComments.forEach(c => {
      const node = map.get(c.id)!;
      if (c.parentId === null) {
        roots.push(node);
      } else {
        const parentNode = map.get(c.parentId);
        if (parentNode) {
          parentNode.replies!.push(node);
        } else {
          roots.push(node);
        }
      }
    });

    const sortTree = (nodes: Comment[]) => {
      nodes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      nodes.forEach(n => {
        if (n.replies && n.replies.length > 0) sortTree(n.replies);
      });
    };
    sortTree(roots);
    
    groupedComments[pid] = roots;
  });

  const renderProductHeader = (productId: number, totalCount: number, unreadCount: number, type: 'review' | 'comment') => {
    const product = products[productId];
    const isExpanded = expandedProductIds.has(productId);
    return (
      <div 
        className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 rounded-t-xl"
        onClick={() => toggleProduct(productId, unreadCount, type)}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="w-full h-full rounded-xl bg-white border border-gray-200 overflow-hidden flex items-center justify-center">
              {product?.img ? (
                <img src={product.img.split(',')[0]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <Package size={24} className="text-gray-400" />
              )}
            </div>
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
              {product?.name || `Sản phẩm ID: ${productId}`}
            </h3>
            <span className="text-xs text-gray-500">{totalCount} {type === 'review' ? 'đánh giá tổng cộng' : 'bình luận tổng cộng'}</span>
          </div>
        </div>
        <div className="text-gray-400 flex items-center gap-3">
          {unreadCount > 0 && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded-full">{unreadCount} mới</span>}
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
    );
  };

  const renderCommentThread = (comment: Comment, level = 0) => {
    return (
      <div key={comment.id} className={`mt-4 ${level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100' : 'pb-4 border-b border-gray-50 last:border-0'}`}>
        <div className="flex items-start gap-3">
          <div className={`rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shrink-0 ${level === 0 ? 'w-9 h-9 text-sm' : 'w-7 h-7 text-xs'}`}>
            {comment.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className={`rounded-xl p-3 ${!comment.isRead ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{comment.user?.email || 'Ẩn danh'}</span>
                  {!comment.isRead && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Mới</span>
                  )}
                </div>
                <span className="text-xs text-gray-400">{comment.createdAt ? new Date(comment.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : ''}</span>
              </div>
              <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
            </div>

            {replyingId === comment.id ? (
              <div className="mt-2 flex gap-2 ml-1">
                <input
                  value={replyText[comment.id] || ''}
                  onChange={e => setReplyText(p => ({ ...p, [comment.id]: e.target.value }))}
                  placeholder="Nhập phản hồi..."
                  className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:border-blue-500 outline-none shadow-sm"
                  onKeyDown={e => e.key === 'Enter' && handleReply(comment.id, comment.productId)}
                  autoFocus
                />
                <button onClick={() => handleReply(comment.id, comment.productId)} className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm">Gửi</button>
                <button onClick={() => setReplyingId(null)} className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg transition hover:bg-gray-200">Huỷ</button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setReplyingId(comment.id);
                  setComments(prev => prev.map(c => c.id === comment.id ? { ...c, isRead: true } : c));
                }} 
                className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition mt-2 ml-2"
              >
                <Reply size={12} /> Phản hồi
              </button>
            )}
          </div>
        </div>
        
        {/* Render child replies recursively */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            {!expandedComments.has(comment.id) ? (
              <button 
                onClick={() => toggleReplies(comment.id)}
                className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800 transition py-1"
              >
                <div className="w-5 border-b border-blue-300"></div>
                Xem thêm {countComments(comment.replies)} phản hồi
                {countUnread(comment.replies) > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full ml-1">
                    {countUnread(comment.replies)} mới
                  </span>
                )}
              </button>
            ) : (
              <>
                <button 
                  onClick={() => toggleReplies(comment.id)}
                  className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition mb-2 py-1"
                >
                  <div className="w-5 border-b border-gray-300"></div>
                  Ẩn phản hồi
                </button>
                {comment.replies.map(reply => renderCommentThread(reply, level + 1))}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý Tương tác</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Phản hồi bình luận và đánh giá từ khách hàng</p>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-2 pt-2 rounded-t-xl shadow-sm">
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors relative ${
            activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } flex items-center gap-2`}
        >
          <Star size={16} /> Đánh giá sản phẩm
          {reviews.filter(r => !r.isRead && !readProductIds.has(r.productId)).length > 0 && (
            <span className="bg-red-500 w-2 h-2 rounded-full absolute top-3 right-3" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors relative ${
            activeTab === 'comments'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          } flex items-center gap-2`}
        >
          <MessageCircle size={16} /> Bình luận / Hỏi đáp
          {comments.filter(c => !c.isRead && !readProductIds.has(c.productId)).length > 0 && (
            <span className="bg-red-500 w-2 h-2 rounded-full absolute top-3 right-3" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="admin-card"><div className="admin-loading">{[...Array(3)].map((_, i) => <div key={i} className="admin-loading-row"><div className="admin-skeleton h-4 w-48" /><div className="admin-skeleton h-4 w-24" /></div>)}</div></div>
      ) : activeTab === 'reviews' ? (
        // REVIEWS TAB
        Object.keys(groupedReviews).length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty">
              <Star className="admin-empty-icon" />
              <p className="admin-empty-title">Chưa có đánh giá nào</p>
              <p className="admin-empty-desc">Các đánh giá có gắn sao từ khách hàng sẽ xuất hiện tại đây</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedReviews).map(([productIdStr, productReviews]) => {
              const productId = Number(productIdStr);
              const isExpanded = expandedProductIds.has(productId);
              const unreadCount = readProductIds.has(productId) ? 0 : productReviews.filter(r => !r.isRead).length;
              return (
                <div key={productId} className="admin-card p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {renderProductHeader(productId, productReviews.length, unreadCount, 'review')}
                  
                  {isExpanded && (
                    <div className="p-4 bg-white">
                      {productReviews.map(review => (
                        <div key={review.id} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0 mb-4 last:mb-0">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm">
                            {review.user?.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className={`flex-1 min-w-0 rounded-xl p-3 ${!review.isRead ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50'}`}>
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900 text-sm">{review.user?.email || 'Ẩn danh'}</span>
                                {!review.isRead && (
                                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Mới</span>
                                )}
                              </div>
                              <span className="text-xs text-gray-400">{review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }) : ''}</span>
                            </div>
                            <div className="text-yellow-500 text-xs mb-1">{renderStars(review.rating || 5)}</div>
                            <p className="text-gray-700 text-sm mt-1">{review.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        // COMMENTS TAB
        Object.keys(groupedComments).length === 0 ? (
          <div className="admin-card">
            <div className="admin-empty">
              <MessageSquare className="admin-empty-icon" />
              <p className="admin-empty-title">Chưa có bình luận nào</p>
              <p className="admin-empty-desc">Các câu hỏi và bình luận từ khách hàng sẽ xuất hiện tại đây</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedComments).map(([productIdStr, productCommentsTree]) => {
              const productId = Number(productIdStr);
              const isExpanded = expandedProductIds.has(productId);
              
              const totalCountRaw = groupedCommentsRaw[productId].length;
              const unreadCount = readProductIds.has(productId) ? 0 : groupedCommentsRaw[productId].filter(c => !c.isRead).length;

              return (
                <div key={productId} className="admin-card p-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {renderProductHeader(productId, totalCountRaw, unreadCount, 'comment')}
                  
                  {isExpanded && (
                    <div className="p-4 bg-white">
                      {productCommentsTree.map(comment => renderCommentThread(comment, 0))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
};

export default SellerComments;
