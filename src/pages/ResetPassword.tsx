import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
        setEmail('');
      } else {
        setError(data.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">

      {/* Subtle Background Graphics */}
      <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>

      <Header />

      <main className="flex-1 flex flex-col pt-20 pb-40 relative z-10 px-[10%]">
        <div className="max-w-[900px]">
          <p className="text-[#0f172a] text-[15px] mb-6">
            Quên mật khẩu? Vui lòng nhập địa chỉ email đã đăng ký. Mật khẩu mới sẽ được gửi đến email của bạn.
          </p>

          <form onSubmit={handleSubmit}>
            <label className="block text-[#0f172a] font-bold text-[15.5px] mb-2">
              Địa chỉ email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              placeholder="Nhập email đã đăng ký"
              className="w-full md:w-[60%] border border-gray-200 rounded p-[12px] text-[15px] focus:outline-none focus:border-orange-500 shadow-sm bg-white block mb-4"
            />

            {error && (
              <p className="text-red-500 text-[13.5px] font-medium mb-4">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-[13.5px] font-medium mb-4">{success}</p>
            )}

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#e05424] hover:bg-[#c2461c] disabled:opacity-60 text-white font-bold py-[12px] px-8 rounded shadow-sm text-sm uppercase tracking-wide"
              >
                {loading ? 'Đang gửi...' : 'ĐẶT LẠI MẬT KHẨU'}
              </button>
              <Link to="/auth" className="text-[#ea580c] font-bold text-[14px] hover:text-[#c2410b] transition-colors">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ResetPassword;
