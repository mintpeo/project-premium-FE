import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FacebookCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (!accessToken) {
      setError('Không tìm thấy access token');
      return;
    }

    fetch('http://localhost:8080/api/auth/facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          login(data.data);
          const role = data.data.role;
          if (role === 'ADMIN') navigate('/admin/dashboard');
          else if (role === 'SELLER') navigate('/seller/dashboard');
          else navigate('/');
        } else {
          setError(data.message || 'Đăng nhập Facebook thất bại');
        }
      })
      .catch(() => setError('Không thể kết nối đến server'))
      .finally(() => {
        window.location.hash = '';
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#edf3f6]">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-500 font-bold text-lg mb-4">{error}</p>
          <button onClick={() => navigate('/auth')} className="bg-[#e85a21] text-white px-6 py-2 rounded font-bold">
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#edf3f6]">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="animate-spin w-10 h-10 border-4 border-[#e85a21] border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Đang đăng nhập Facebook...</p>
      </div>
    </div>
  );
};

export default FacebookCallback;
