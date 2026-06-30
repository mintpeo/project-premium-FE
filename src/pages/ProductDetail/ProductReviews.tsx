import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Review {
  id: number;
  productId: number;
  userId: number;
  fullName: string;
  stars: number;
  content: string;
  createdAt: string;
}

const RATING_LABELS = ['', 'Không hài lòng', 'Tạm được', 'Bình thường', 'Hài lòng', 'Cực kì hài lòng'];

const ProductReviews = ({ productId }: { productId: number }) => {
  const { user, isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [stars, setStars] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:8080/api/review/${productId}`)
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [productId]);

  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((s, r) => s + r.stars, 0) / totalReviews).toFixed(1)
    : '5';
  const starCounts = [5, 4, 3, 2, 1].map(s => reviews.filter(r => r.stars === s).length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) { setError('Vui lòng nhập nội dung đánh giá'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userId: user!.id, stars, content }),
      });
      if (res.ok) {
        setSuccess('Đánh giá của bạn đã được gửi!');
        setContent('');
        setStars(5);
        setTimeout(() => { setShowModal(false); setSuccess(''); }, 2000);
      } else {
        const errText = await res.text();
        setError(errText || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối server.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    if (!isLoggedIn) {
      window.location.href = '/auth';
      return;
    }
    setShowModal(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col mt-4 mb-10">
      <h2 className="text-[18px] font-bold text-[#1e293b] mb-6 uppercase">Đánh giá - nhận xét từ khách hàng</h2>

      {/* Overview */}
      <div className="border border-gray-100 rounded-lg p-6 mb-8 flex flex-col md:flex-row gap-8 items-center shadow-sm">
        {/* Rating stats */}
        <div className="flex flex-col flex-1 w-full md:border-r border-gray-100 pr-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-[48px] font-black text-[#1e293b] leading-none">{avgRating}</span>
            <div className="flex flex-col">
              <div className="flex text-[#fbbf24] text-[18px] tracking-widest">★★★★★</div>
              <span className="text-[13px] text-gray-500 font-medium mt-1">{totalReviews} đánh giá</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full mt-2">
            {[5, 4, 3, 2, 1].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex text-[#fbbf24] text-[12px] w-[60px] justify-end">
                  {'★'.repeat(s)}<span className="text-gray-200">{'★'.repeat(5 - s)}</span>
                </div>
                <div className="flex-1 h-[6px] bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-gray-600 rounded-full"
                    style={{ width: totalReviews > 0 ? `${(starCounts[i] / totalReviews) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-[12px] text-gray-500 w-[20px]">{starCounts[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center items-center flex-1 w-full md:border-r border-gray-100 px-4 min-h-[100px]">
          <span className="text-gray-500 font-medium text-[14px]">Hình ảnh đánh giá</span>
        </div>

        <div className="flex flex-col justify-center items-center flex-1 w-full">
          <button
            onClick={handleOpenModal}
            className="bg-[#1e90ff] hover:bg-blue-600 text-white font-bold py-2.5 px-6 rounded shadow-sm transition text-sm"
          >
            Gửi đánh giá của bạn
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center flex-wrap gap-3 mb-8 border-b border-gray-100 pb-6">
        <span className="text-[#334155] font-medium text-[14px] mr-2">Lọc xem theo:</span>
        {[5, 4, 3, 2, 1].map(num => (
          <button key={num} className="bg-gray-100 hover:bg-gray-200 text-[#334155] px-4 py-1.5 rounded-full text-[13px] font-medium transition flex items-center gap-1">
            {num} <Star size={12} className="text-[#fbbf24] fill-[#fbbf24]" />
          </button>
        ))}
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="flex flex-col md:flex-row gap-4 border-b border-gray-100 pb-6 w-full">
              <div className="w-[200px] shrink-0 flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#fbbf24] rounded-full flex items-center justify-center font-bold text-white text-[15px]">
                    {review.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-[#1e293b] text-[14px]">{review.fullName}</span>
                    <span className="text-[12px] text-gray-500">Thành viên</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col pt-1">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="flex text-[#fbbf24] text-[13px] tracking-widest leading-none">
                    {'★'.repeat(review.stars)}<span className="text-gray-200">{'★'.repeat(5 - review.stars)}</span>
                  </div>
                  <span className="font-bold text-[#334155] text-[14px]">{RATING_LABELS[review.stars]}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-3">
                  <CheckCircle2 size={12} className="text-[#10b981]" />
                  <span className="text-[12px] text-[#10b981] font-medium">Đã mua từ Premiumkey</span>
                </div>
                <p className="text-[14px] text-[#334155] leading-relaxed mb-1 whitespace-pre-line">{review.content}</p>
                <span className="text-[12px] text-gray-400 mb-3 block">Nhận xét vào {review.createdAt}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal form đánh giá */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
            >
              <X size={22} />
            </button>

            <h3 className="text-xl font-bold text-[#1e293b] mb-6">Gửi đánh giá của bạn</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Chọn số sao */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverStar(s)}
                      onMouseLeave={() => setHoverStar(0)}
                      onClick={() => setStars(s)}
                      className="text-3xl transition-transform hover:scale-110"
                    >
                      <span className={(hoverStar || stars) >= s ? 'text-[#fbbf24]' : 'text-gray-200'}>★</span>
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">{RATING_LABELS[hoverStar || stars]}</span>
                </div>
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá *</label>
                <textarea
                  rows={4}
                  value={content}
                  onChange={e => { setContent(e.target.value); setError(''); }}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 text-sm focus:outline-none focus:border-blue-400 resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm font-medium">{success}</p>}

              <div className="flex gap-3 pt-1">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#1e90ff] hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition text-sm"
                >
                  {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition text-sm"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
