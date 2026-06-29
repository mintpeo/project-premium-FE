import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8080/api/user/profile/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          setFullName(data.data.fullName || '');
          setPhoneNumber(data.data.phoneNumber || '');
          setEmail(data.data.email || '');
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch(`http://localhost:8080/api/user/profile/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phoneNumber }),
      });
      if (res.ok) {
        setProfileMsg('Cập nhật thông tin thành công');
      } else {
        const data = await res.json();
        setProfileMsg(data.error || 'Cập nhật thất bại');
      }
    } catch {
      setProfileMsg('Lỗi kết nối');
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwdMsg('Mật khẩu xác nhận không khớp'); return; }
    setSaving(true);
    setPwdMsg('');
    try {
      const res = await fetch(`http://localhost:8080/api/user/change-password/${user?.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      if (res.ok) {
        setPwdMsg('Đổi mật khẩu thành công');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        const data = await res.json();
        setPwdMsg(data.error || 'Đổi mật khẩu thất bại');
      }
    } catch {
      setPwdMsg('Lỗi kết nối');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Cài đặt tài khoản</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin cá nhân</h3>
            {loading ? (
              <div className="space-y-3">
                <div className="admin-skeleton h-10 w-full" />
                <div className="admin-skeleton h-10 w-full" />
                <div className="admin-skeleton h-10 w-full" />
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input type="email" value={email} disabled className="admin-input bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                  <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="admin-input" placeholder="0987654321" />
                </div>
                {profileMsg && (
                  <p className={`text-sm font-medium ${profileMsg.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{profileMsg}</p>
                )}
                <button type="submit" disabled={saving} className="admin-btn-primary">
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="admin-card">
          <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Đổi mật khẩu</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="admin-input" />
              </div>
              {pwdMsg && (
                <p className={`text-sm font-medium ${pwdMsg.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>{pwdMsg}</p>
              )}
              <button type="submit" disabled={saving} className="admin-btn-primary">
                {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
