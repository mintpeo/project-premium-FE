import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (data.success) {
        login(data.data);
        const role = data.data.role;
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'SELLER') navigate('/seller/dashboard');
        else navigate('/');
      } else {
        setError(data.message || 'Email hoặc mật khẩu không đúng');
      }
    } catch {
      setError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const loginFacebook = () => {
    const appId = '2107794746788457';
    const redirectUri = 'http://localhost:5173/facebook-callback';
    const url = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&response_type=token&scope=public_profile`;
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
      <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 mb-20 px-4">
        <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl overflow-hidden mt-8 p-8 pb-10">
          <h1 className="text-2xl font-bold text-[#0f172a] text-center mb-8">Đăng nhập</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Địa chỉ email"
              required
              className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Mật khẩu"
              required
              className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
            />

            {error && (
              <p className="text-red-500 text-[13.5px] font-medium">{error}</p>
            )}

            <div>
              <p className="font-bold text-[#0f172a] text-[14.5px] mt-1 mb-3">Đăng nhập bằng mạng xã hội</p>
              <div className="flex gap-2">
                <button onClick={loginGoogle} type="button" className="flex items-center justify-center gap-3 bg-[#f2f2f2] hover:bg-gray-200 text-[#0f172a] font-bold py-3.5 rounded transition-colors w-full shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.74 12.27c0-.86-.07-1.68-.21-2.47H12v4.67h6.58c-.28 1.51-1.12 2.79-2.39 3.65v3.02h3.87c2.26-2.09 3.68-5.17 3.68-8.87z" /><path fill="#34A853" d="M12 24c3.31 0 6.08-1.1 8.11-2.97l-3.87-3.02c-1.1.74-2.51 1.18-4.24 1.18-3.26 0-6.02-2.2-7.01-5.16H1.02v3.13C3.06 21.05 7.21 24 12 24z" /><path fill="#FBBC05" d="M4.99 14.03A7.05 7.05 0 014.62 12c0-.71.13-1.4.37-2.03V6.84H1.02C.37 8.15 0 9.7 0 12s.37 3.85 1.02 5.16l3.97-3.13z" /><path fill="#EA4335" d="M12 4.79c1.8 0 3.42.62 4.7 1.83l3.53-3.53C18.07 1.1 15.3 0 12 0 7.21 0 3.06 2.95 1.02 6.84l3.97 3.13c.99-2.96 3.75-5.18 7.01-5.18z" /></svg>
                  <span className="text-[15px]">Google</span>
                </button>
                <button onClick={loginFacebook} type="button" className="flex items-center justify-center gap-3 bg-[#f2f2f2] hover:bg-gray-200 text-[#0f172a] font-bold py-3.5 rounded transition-colors w-full shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-[15px]">Facebook</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-b from-[#f5741c] to-[#e4511d] hover:to-[#cd4617] active:to-[#b63c11] disabled:opacity-60 text-white font-bold py-[14px] rounded shadow-[0_2px_10px_rgba(232,90,33,0.3)] uppercase tracking-wide text-sm border border-[#e85a21]"
            >
              {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
            </button>

            <div className="flex items-center justify-between mt-1">
              <Link to="/auth" className="text-[#ea580c] font-bold text-[14px] hover:text-[#c2410b] transition-colors">Tạo tài khoản mới</Link>
              <Link to="/reset-password" className="text-[#ea580c] font-bold text-[14px] hover:text-[#c2410b] transition-colors">Quên mật khẩu?</Link>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Login;
