import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isRemember, setIsRemember] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.data);
        const role = data.data.role;
        if (role === 'ADMIN') navigate('/admin/dashboard');
        else if (role === 'SELLER') navigate('/seller/dashboard');
        else navigate('/');
      } else {
        setLoginError(data.message || 'Đăng nhập thất bại');
      }
    } catch {
      setLoginError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Register state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
    setRegisterError('');
  };

  const handleSendOtp = async () => {
    if (!registerForm.fullName || !registerForm.email) {
      setRegisterError('Vui lòng nhập họ tên và email trước');
      return;
    }
    setRegisterError('');
    setOtpLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: registerForm.fullName,
          email: registerForm.email,
          phoneNumber: registerForm.phoneNumber,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setRegisterError('');
      } else {
        setRegisterError(data.message || 'Không thể gửi mã. Vui lòng thử lại.');
      }
    } catch {
      setRegisterError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterError('Mật khẩu xác nhận không khớp');
      return;
    }

    setRegisterLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      const data = await res.json();
      if (data.success) {
        setRegisterSuccess('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        setRegisterForm({ fullName: '', email: '', phoneNumber: '', otp: '', password: '', confirmPassword: '' });
        setOtpSent(false);
      } else {
        setRegisterError(data.message || 'Đăng ký thất bại');
      }
    } catch {
      setRegisterError('Không thể kết nối đến server. Vui lòng thử lại.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">

      {/* Subtle Background Graphics */}
      <div className="absolute top-[20%] left-[15%] w-48 h-48 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-[20%] right-[15%] w-60 h-60 bg-[#cde0ea] rounded-full opacity-60 z-0 mix-blend-multiply blur-xl"></div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 mb-20 px-4">
        <div className="w-full max-w-[500px] bg-transparent rounded-t-[10px] rounded-b-xl shadow-xl overflow-hidden mt-8 flex flex-col">

          {/* Tabs */}
          <div className="flex text-center text-white h-[60px] font-bold text-[15px] border-b-4 border-white/5 bg-[#333333]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 flex items-center justify-center transition-colors rounded-tr-lg rounded-tl-lg ${isLogin ? 'bg-[#e85a21] z-10' : 'bg-[#333333] opacity-90'}`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 flex items-center justify-center transition-colors rounded-tr-lg rounded-tl-lg ${!isLogin ? 'bg-[#e85a21] z-10 text-white' : 'bg-[#333333] opacity-90 text-gray-200'}`}
            >
              Đăng ký
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8 pb-10 bg-white">
            {isLogin ? (
              // Login Form
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6">
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginError(''); }}
                  placeholder="Địa chỉ email"
                  required
                  className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); setLoginError(''); }}
                  placeholder="Mật khẩu"
                  required
                  className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
                />

                {loginError && (
                  <p className="text-red-500 text-[13.5px] font-medium -mt-2">{loginError}</p>
                )}

                <div>
                  <p className="font-bold text-[#0f172a] text-[14.5px] mt-1 mb-3">Đăng nhập bằng mạng xã hội</p>
                  <button type="button" className="flex items-center justify-center gap-3 bg-[#f2f2f2] hover:bg-gray-200 text-[#0f172a] font-bold py-3.5 rounded transition-colors w-full shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.74 12.27c0-.86-.07-1.68-.21-2.47H12v4.67h6.58c-.28 1.51-1.12 2.79-2.39 3.65v3.02h3.87c2.26-2.09 3.68-5.17 3.68-8.87z" /><path fill="#34A853" d="M12 24c3.31 0 6.08-1.1 8.11-2.97l-3.87-3.02c-1.1.74-2.51 1.18-4.24 1.18-3.26 0-6.02-2.2-7.01-5.16H1.02v3.13C3.06 21.05 7.21 24 12 24z" /><path fill="#FBBC05" d="M4.99 14.03A7.05 7.05 0 014.62 12c0-.71.13-1.4.37-2.03V6.84H1.02C.37 8.15 0 9.7 0 12s.37 3.85 1.02 5.16l3.97-3.13z" /><path fill="#EA4335" d="M12 4.79c1.8 0 3.42.62 4.7 1.83l3.53-3.53C18.07 1.1 15.3 0 12 0 7.21 0 3.06 2.95 1.02 6.84l3.97 3.13c.99-2.96 3.75-5.18 7.01-5.18z" /></svg>
                    <span className="text-[15px]">Đăng nhập Google</span>
                  </button>
                </div>

                <div className="mt-1">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="bg-gradient-to-b from-[#f5741c] to-[#e4511d] hover:to-[#cd4617] active:to-[#b63c11] disabled:opacity-60 text-white font-bold py-[14px] rounded shadow-[0_2px_10px_rgba(232,90,33,0.3)] min-w-[30%] uppercase tracking-wide text-sm px-10 border border-[#e85a21]"
                  >
                    {loginLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                  </button>
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={isRemember}
                      onChange={(e) => setIsRemember(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-[#e85a21] appearance-auto"
                    />
                    <label htmlFor="remember" className="text-[14px] font-bold text-[#333333] cursor-pointer selection:bg-transparent">
                      Ghi nhớ mật khẩu
                    </label>
                  </div>
                  <div>
                    <Link to="/reset-password" className="text-[#ea580c] font-bold text-[14px] hover:text-[#c2410b] transition-colors">Quên mật khẩu?</Link>
                  </div>
                </div>
              </form>
            ) : (
              // Register Form
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5">
                <input
                  type="text"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Họ và tên"
                  required
                  disabled={otpSent}
                  className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="Địa chỉ email"
                    required
                    disabled={otpSent}
                    className="flex-1 border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpLoading || otpSent}
                    className="bg-gray-700 hover:bg-gray-800 disabled:opacity-60 text-white font-bold px-4 rounded text-[13px] whitespace-nowrap"
                  >
                    {otpSent ? '✓ Đã gửi' : otpLoading ? 'Đang gửi...' : 'Gửi mã'}
                  </button>
                </div>
                <input
                  type="text"
                  name="phoneNumber"
                  value={registerForm.phoneNumber}
                  onChange={handleRegisterChange}
                  placeholder="Số điện thoại (tùy chọn)"
                  disabled={otpSent}
                  className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm disabled:bg-gray-50 disabled:text-gray-400"
                />

                {otpSent && (
                  <>
                    <div>
                      <p className="text-green-600 text-[13px] font-medium mb-2">
                        ✓ Mã xác nhận đã gửi đến <strong>{registerForm.email}</strong>. Có hiệu lực trong 5 phút.
                      </p>
                      <input
                        type="text"
                        name="otp"
                        value={registerForm.otp}
                        onChange={handleRegisterChange}
                        placeholder="Nhập mã xác nhận (6 số)"
                        required
                        maxLength={6}
                        className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm tracking-widest text-center font-bold"
                      />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Mật khẩu (ít nhất 6 ký tự)"
                      required
                      className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Xác nhận mật khẩu"
                      required
                      className="w-full border border-gray-200 rounded p-[14px] text-[15px] focus:outline-none focus:border-orange-500 placeholder-gray-500 text-[#0f172a] shadow-sm"
                    />
                  </>
                )}

                {registerError && (
                  <p className="text-red-500 text-[13.5px] font-medium">{registerError}</p>
                )}
                {registerSuccess && (
                  <p className="text-green-600 text-[13.5px] font-medium">{registerSuccess}</p>
                )}

                <p className="text-[14px] text-gray-600 leading-relaxed font-medium">
                  Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng, hỗ trợ trải nghiệm của bạn trên toàn bộ trang web này và cho các mục đích khác được mô tả trong <a href="#" className="text-[#ea580c] font-bold hover:underline">chính sách riêng tư</a>.
                </p>

                {otpSent && (
                  <div className="mt-1">
                    <button
                      type="submit"
                      disabled={registerLoading}
                      className="bg-gradient-to-b from-[#f5741c] to-[#e4511d] hover:to-[#cd4617] active:to-[#b63c11] disabled:opacity-60 text-white font-bold py-[14px] rounded shadow-[0_2px_10px_rgba(232,90,33,0.3)] min-w-[30%] uppercase tracking-wide text-sm flex items-center justify-center border border-[#e85a21] px-10"
                    >
                      {registerLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Auth;
