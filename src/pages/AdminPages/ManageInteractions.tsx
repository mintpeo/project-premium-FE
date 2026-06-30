import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Star, MessageCircle, Eye, EyeOff, Reply, Package, Search, ChevronDown, ChevronUp, X, CheckCircle } from 'lucide-react';

interface Review {
  id: number;
  content: string;
  stars: number;
  user: { id: number; email: string; fullName: string };
  productId: number;
  productName: string;
  productImg: string;
  status: 'PENDING' | 'APPROVED' | 'HIDDEN';
  createdAt: string;
  isRead: boolean;
  shopReply?: string;
  sellerId?: number;
  categoryIds?: number[];
}

interface Comment {
  id: number;
  content: string;
  user: { id: number; email: string; fullName: string };
  productId: number;
  productName: string;
  productImg: string;
  parentId: number | null;
  status: 'PENDING' | 'APPROVED' | 'HIDDEN';
  createdAt: string;
  isRead: boolean;
  replies?: Comment[];
  sellerId?: number;
  categoryIds?: number[];
}

const ManageInteractions = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('ALL');
  const [categories, setCategories] = useState<any[]>([]);
  const [sellers, setSellers] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('ALL');
  const [selectedSellerId, setSelectedSellerId] = useState<string>('ALL');

  // Modal State
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // Reply State
  const [replyText, setReplyText] = useState<Record<number, string>>({});
  const [replyingId, setReplyingId] = useState<number | null>(null);
  
  // Expanded State for Reviews (to show shop replies) and Comments (to show sub-comments)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const fetchFilters = async () => {
    try {
      const [catRes, selRes] = await Promise.all([
        fetch('http://localhost:8080/api/admin/categories'),
        fetch('http://localhost:8080/api/admin/sellers')
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (selRes.ok) setSellers(await selRes.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    } else {
      fetchComments();
    }
  }, [activeTab]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/reviews/all`);
      if (res.ok) setReviews(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/comments/all`);
      if (res.ok) setComments(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (id: number, type: 'review' | 'comment', newStatus: 'APPROVED' | 'HIDDEN') => {
    try {
      const endpoint = newStatus === 'HIDDEN' 
        ? `http://localhost:8080/api/admin/${type}s/${id}/hide`
        : `http://localhost:8080/api/admin/${type}s/${id}/approve`;
      
      const res = await fetch(endpoint, { method: 'PUT' });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      
      if (type === 'review') {
        setReviews(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
      } else {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
      }
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật trạng thái'));
    }
  };

  const handleReplyReview = async (reviewId: number) => {
    const content = replyText[reviewId]?.trim();
    if (!content) return;
    try {
      const res = await fetch('http://localhost:8080/api/admin/reviews/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, content }),
      });
      if (!res.ok) throw new Error('Gửi phản hồi thất bại');
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      setReplyingId(null);
      await fetchReviews();
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleReplyComment = async (parentId: number, productId: number) => {
    const content = replyText[parentId]?.trim();
    if (!content) return;
    try {
      const res = await fetch('http://localhost:8080/api/admin/comments/reply', {
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

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleOpenDetail = async (pid: number) => {
    setSelectedProductId(pid);
    const hasUnread = activeTab === 'reviews' 
      ? groupedReviews[pid]?.some((i: any) => !i.isRead) 
      : groupedCommentsRaw[pid]?.some((i: any) => !i.isRead);

    if (hasUnread) {
      try {
        const type = activeTab === 'reviews' ? 'reviews' : 'comments';
        await fetch(`http://localhost:8080/api/admin/${type}/read/${pid}`, { method: 'PUT' });
        
        if (activeTab === 'reviews') {
          setReviews(prev => prev.map(r => r.productId === pid ? { ...r, isRead: true } : r));
        } else {
          setComments(prev => prev.map(c => c.productId === pid ? { ...c, isRead: true } : c));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const countComments = (nodes: Comment[]): number => {
    return nodes.reduce((acc, node) => acc + 1 + countComments(node.replies || []), 0);
  };

  // 1. Filter raw data first based on search and statusFilter
  const filteredReviewsList = reviews.filter(r => {
    const matchSearch = r.productName?.toLowerCase().includes(search.toLowerCase()) || 
                        r.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchCategory = selectedCategoryId === 'ALL' || r.categoryIds?.includes(Number(selectedCategoryId));
    const matchSeller = selectedSellerId === 'ALL' || r.sellerId === Number(selectedSellerId);
    return matchSearch && matchStatus && matchCategory && matchSeller;
  });

  const filteredCommentsList = comments.filter(c => {
    const matchSearch = c.productName?.toLowerCase().includes(search.toLowerCase()) || 
                        c.content.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchCategory = selectedCategoryId === 'ALL' || c.categoryIds?.includes(Number(selectedCategoryId));
    const matchSeller = selectedSellerId === 'ALL' || c.sellerId === Number(selectedSellerId);
    return matchSearch && matchStatus && matchCategory && matchSeller;
  });

  // 2. Group the filtered data by Product
  const groupedReviews = filteredReviewsList.reduce((acc, r) => {
    if (!acc[r.productId]) acc[r.productId] = [];
    acc[r.productId].push(r);
    return acc;
  }, {} as Record<number, Review[]>);

  const groupedCommentsRaw = filteredCommentsList.reduce((acc, c) => {
    if (!acc[c.productId]) acc[c.productId] = [];
    acc[c.productId].push(c);
    return acc;
  }, {} as Record<number, Comment[]>);

  // Build trees for comments
  const groupedComments: Record<number, Comment[]> = {};
  Object.keys(groupedCommentsRaw).forEach(pidStr => {
    const pid = Number(pidStr);
    const productComments = groupedCommentsRaw[pid];
    const map = new Map<number, Comment>();
    productComments.forEach(c => map.set(c.id, { ...c, replies: [] }));

    const roots: Comment[] = [];
    productComments.forEach(c => {
      const node = map.get(c.id)!;
      if (c.parentId === null || !map.has(c.parentId)) {
        roots.push(node);
      } else {
        const parentNode = map.get(c.parentId);
        if (parentNode) parentNode.replies!.push(node);
      }
    });

    const sortTree = (nodes: Comment[]) => {
      nodes.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      nodes.forEach(n => { if (n.replies && n.replies.length > 0) sortTree(n.replies); });
    };
    sortTree(roots);
    groupedComments[pid] = roots;
  });

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <span className="bg-orange-100 text-orange-700 text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap">Chờ duyệt</span>;
      case 'APPROVED': return <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap">Đã duyệt</span>;
      case 'HIDDEN': return <span className="bg-gray-100 text-gray-700 text-[10px] px-2 py-1 rounded font-semibold whitespace-nowrap">Đã ẩn</span>;
      default: return null;
    }
  };

  const renderActionButtons = (item: any, type: 'review' | 'comment') => {
    return (
      <div className="flex flex-col gap-1 items-center">
        {item.status === 'PENDING' && (
          <div className="flex gap-1">
            <button 
              onClick={() => changeStatus(item.id, type, 'APPROVED')}
              className="p-1.5 rounded-lg text-green-600 bg-green-50 hover:bg-green-100" title="Duyệt"
            >
              <CheckCircle size={16} />
            </button>
            <button 
              onClick={() => changeStatus(item.id, type, 'HIDDEN')}
              className="p-1.5 rounded-lg text-red-600 bg-red-50 hover:bg-red-100" title="Từ chối / Ẩn"
            >
              <EyeOff size={16} />
            </button>
          </div>
        )}
        {item.status === 'APPROVED' && (
          <button 
            onClick={() => changeStatus(item.id, type, 'HIDDEN')}
            className="p-1.5 rounded-lg text-red-500 bg-red-50 hover:bg-red-100" title="Ẩn đi"
          >
            <EyeOff size={16} />
          </button>
        )}
        {item.status === 'HIDDEN' && (
          <button 
            onClick={() => changeStatus(item.id, type, 'APPROVED')}
            className="p-1.5 rounded-lg text-green-600 bg-green-50 hover:bg-green-100" title="Duyệt / Hiện"
          >
            <CheckCircle size={16} />
          </button>
        )}
      </div>
    );
  };

  // Modal Renderers
  const renderReviewItem = (review: Review) => (
    <div key={review.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0 mb-4 last:mb-0">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
            {review.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-gray-900">{review.user?.fullName || review.user?.email}</p>
              {!review.isRead && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Mới</span>}
            </div>
            <div className="text-yellow-500 text-xs mb-1">{renderStars(review.stars || 5)}</div>
            <p className="text-sm text-gray-700 mt-1">{review.content}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleString('vi-VN')}</p>
            
            {review.shopReply ? (
              <div className="mt-2">
                <button 
                  onClick={() => toggleExpand(review.id)}
                  className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:text-blue-800"
                >
                  {expandedItems.has(review.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  Xem phản hồi của shop
                </button>
                {expandedItems.has(review.id) && (
                  <div className="mt-2 ml-2 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-800 relative">
                    <div className="absolute -left-2 top-3 w-2 h-px bg-blue-200"></div>
                    <p className="font-semibold text-blue-700 text-xs mb-1">Phản hồi từ Shop:</p>
                    {review.shopReply}
                  </div>
                )}
              </div>
            ) : (
              replyingId === review.id ? (
                <div className="mt-3 flex gap-2 w-full max-w-md">
                  <input
                    value={replyText[review.id] || ''}
                    onChange={e => setReplyText(p => ({ ...p, [review.id]: e.target.value }))}
                    placeholder="Nhập phản hồi..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                    onKeyDown={e => e.key === 'Enter' && handleReplyReview(review.id)}
                    autoFocus
                  />
                  <button onClick={() => handleReplyReview(review.id)} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Gửi</button>
                  <button onClick={() => setReplyingId(null)} className="px-2 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg">Huỷ</button>
                </div>
              ) : (
                <button 
                  onClick={() => setReplyingId(review.id)}
                  className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1 hover:text-blue-600"
                >
                  <Reply size={14} /> Trả lời
                </button>
              )
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(review.status)}
          {renderActionButtons(review, 'review')}
        </div>
      </div>
    </div>
  );

  const renderCommentItem = (comment: Comment, level = 0) => (
    <div key={comment.id} className={`mb-4 ${level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-100 mt-3' : 'pb-4 border-b border-gray-100 last:border-0'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shrink-0 ${level === 0 ? 'w-8 h-8 text-xs' : 'w-6 h-6 text-[10px]'}`}>
            {comment.user?.email?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-gray-900">{comment.user?.fullName || comment.user?.email}</p>
              {!comment.isRead && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">Mới</span>}
              {level > 0 && <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded font-bold">Phản hồi</span>}
            </div>
            <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(comment.createdAt).toLocaleString('vi-VN')}</p>
            
            {replyingId === comment.id ? (
              <div className="mt-3 flex gap-2 w-full max-w-md">
                <input
                  value={replyText[comment.id] || ''}
                  onChange={e => setReplyText(p => ({ ...p, [comment.id]: e.target.value }))}
                  placeholder="Nhập phản hồi..."
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:border-blue-500 outline-none"
                  onKeyDown={e => e.key === 'Enter' && handleReplyComment(comment.id, comment.productId)}
                  autoFocus
                />
                <button onClick={() => handleReplyComment(comment.id, comment.productId)} className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Gửi</button>
                <button onClick={() => setReplyingId(null)} className="px-2 py-1.5 text-sm text-gray-500 bg-gray-100 rounded-lg">Huỷ</button>
              </div>
            ) : (
              <button 
                onClick={() => setReplyingId(comment.id)}
                className="mt-2 text-xs font-medium text-gray-500 flex items-center gap-1 hover:text-blue-600"
              >
                <Reply size={14} /> Trả lời
              </button>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                <button 
                  onClick={() => toggleExpand(comment.id)}
                  className="text-xs font-medium text-blue-600 flex items-center gap-1 hover:text-blue-800"
                >
                  {expandedItems.has(comment.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  {expandedItems.has(comment.id) ? 'Ẩn phản hồi' : `Xem ${countComments(comment.replies)} phản hồi`}
                </button>
                {expandedItems.has(comment.id) && (
                  <div className="mt-2">
                    {comment.replies.map(reply => renderCommentItem(reply, level + 1))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getStatusBadge(comment.status)}
          {renderActionButtons(comment, 'comment')}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý Tương tác (Admin)</h1>
        </div>
      </div>

      <div className="flex border-b border-gray-200 bg-white px-2 pt-2 rounded-t-xl shadow-sm">
        <button
          onClick={() => { setActiveTab('reviews'); setSearch(''); setSelectedProductId(null); setExpandedItems(new Set()); setReplyingId(null); }}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors relative ${
            activeTab === 'reviews' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          } flex items-center gap-2`}
        >
          <Star size={16} /> Đánh giá sản phẩm
          {reviews.filter(r => !r.isRead).length > 0 && (
            <span className="bg-red-500 w-2 h-2 rounded-full absolute top-3 right-3" />
          )}
        </button>
        <button
          onClick={() => { setActiveTab('comments'); setSearch(''); setSelectedProductId(null); setExpandedItems(new Set()); setReplyingId(null); }}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors relative ${
            activeTab === 'comments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          } flex items-center gap-2`}
        >
          <MessageCircle size={16} /> Bình luận / Hỏi đáp
          {comments.filter(c => !c.isRead).length > 0 && (
            <span className="bg-red-500 w-2 h-2 rounded-full absolute top-3 right-3" />
          )}
        </button>
      </div>

      <div className="admin-card p-4">
        <div className="flex items-center gap-3 mb-4 w-full">
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value as any)}
            className="admin-input py-2 px-2 text-sm cursor-pointer border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white !w-[140px] truncate"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chưa duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="HIDDEN">Đã ẩn</option>
          </select>

          <select 
            value={selectedCategoryId} 
            onChange={e => setSelectedCategoryId(e.target.value)}
            className="admin-input py-2 px-2 text-sm cursor-pointer border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white !w-[140px] truncate"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <select 
            value={selectedSellerId} 
            onChange={e => setSelectedSellerId(e.target.value)}
            className="admin-input py-2 px-2 text-sm cursor-pointer border border-gray-200 rounded-lg outline-none focus:border-blue-500 bg-white !w-[140px] truncate"
          >
            <option value="ALL">Tất cả người bán</option>
            {sellers.map(s => (
              <option key={s.id} value={s.id}>{s.fullName || s.email}</option>
            ))}
          </select>
          
          <div className="flex items-center gap-2 bg-gray-100/80 hover:bg-gray-100 transition-colors rounded-lg px-3 py-2 flex-1 border border-transparent focus-within:border-gray-200 focus-within:bg-white">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Tìm tên sản phẩm, nội dung đánh giá..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading-row"><div className="admin-skeleton h-4 w-48" /></div>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  {activeTab === 'reviews' && <th className="text-center">Số sao trung bình</th>}
                  <th className="text-center">Số lượng</th>
                  <th className="text-right pr-5">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(activeTab === 'reviews' ? groupedReviews : groupedComments).map(([pidStr, items]) => {
                  const pid = Number(pidStr);
                  const sample = items[0] as any;
                  
                  let avgStars = 0;
                  if (activeTab === 'reviews') {
                    const sum = (items as Review[]).reduce((acc, r) => acc + (r.stars || 5), 0);
                    avgStars = sum / items.length;
                  }
                  
                  const totalCount = activeTab === 'reviews' ? items.length : groupedCommentsRaw[pid].length;
                  const hasUnread = items.some((i: any) => !i.isRead);

                  return (
                    <tr key={pid} className="cursor-pointer hover:bg-gray-50" onClick={() => handleOpenDetail(pid)}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {sample?.productImg ? (
                              <img src={sample.productImg.split(',')[0]} alt={sample.productName} className="w-10 h-10 rounded border border-gray-200 object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                                <Package size={20} />
                              </div>
                            )}
                            {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>}
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">{sample?.productName || `Sản phẩm ID: ${pid}`}</p>
                        </div>
                      </td>
                      {activeTab === 'reviews' && (
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-bold text-gray-900">{avgStars.toFixed(1)}</span>
                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          </div>
                        </td>
                      )}
                      <td className="text-center">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {totalCount} {activeTab === 'reviews' ? 'Đánh giá' : 'Bình luận'}
                        </span>
                      </td>
                      <td className="text-right pr-5">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Xem chi tiết</button>
                      </td>
                    </tr>
                  );
                })}
                {Object.keys(activeTab === 'reviews' ? groupedReviews : groupedComments).length === 0 && (
                  <tr>
                    <td colSpan={4}>
                      <div className="admin-empty py-12">
                        <Package className="admin-empty-icon" />
                        <p className="admin-empty-title">Không tìm thấy dữ liệu</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedProductId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                Chi tiết {activeTab === 'reviews' ? 'Đánh giá' : 'Bình luận'}
              </h3>
              <button onClick={() => setSelectedProductId(null)} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'reviews' ? (
                groupedReviews[selectedProductId]?.map(review => renderReviewItem(review))
              ) : (
                groupedComments[selectedProductId]?.map(comment => renderCommentItem(comment, 0))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageInteractions;
