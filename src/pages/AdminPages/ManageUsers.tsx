import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
  banned: boolean;
}

const roleLabels: Record<string, string> = {
  CUSTOMER: 'Khách hàng',
  SELLER: 'Người bán',
  ADMIN: 'Quản trị viên',
};

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetUserId, setResetUserId] = useState<number | null>(null);
  const [newPassword, setNewPassword] = useState('123456');
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/users');
      if (!res.ok) throw new Error('Không thể tải danh sách người dùng');
      const data: User[] = await res.json();
      setUsers(data.filter(u => u.role !== 'ADMIN'));
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error('Không thể cập nhật vai trò');
      await fetchUsers();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật'));
    }
  };

  const handleToggleBan = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}/ban`, {
        method: 'PUT',
      });
      if (!res.ok) throw new Error('Không thể cập nhật trạng thái');
      await fetchUsers();
    } catch (err: any) {
      alert('Lỗi: ' + (err.message || 'Không thể cập nhật'));
    }
  };

  const handleResetPassword = async () => {
    if (resetUserId === null || !newPassword) return;
    setSaving(true);
    setNotification(null);
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${resetUserId}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error('Reset mật khẩu thất bại');
      setNotification({ type: 'success', message: 'Đã reset mật khẩu thành công!' });
      setResetUserId(null);
      setNewPassword('123456');
    } catch (err: any) {
      setNotification({ type: 'error', message: err.message || 'Không thể reset mật khẩu' });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
  };

  const roleBadgeClass = (role: string, banned?: boolean) => {
    if (banned) return 'admin-badge-error';
    switch (role) {
      case 'ADMIN': return 'admin-badge-info';
      case 'SELLER': return 'admin-badge-warning';
      default: return 'admin-badge-default';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        </div>
        <div className="admin-card">
          <div className="admin-loading">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="admin-loading-row">
                <div className="admin-skeleton w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="admin-skeleton h-4 w-48" />
                  <div className="admin-skeleton h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý người dùng</h1>
          <span className="admin-page-count">{users.length} người dùng</span>
        </div>
        <a href="http://localhost:8080/api/admin/export/users"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Xuất Excel
        </a>
      </div>

      {notification && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${
          notification.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <svg className="inline w-4 h-4 mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="inline w-4 h-4 mr-1.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {notification.message}
          <button onClick={() => setNotification(null)} className="float-right text-current opacity-50 hover:opacity-100">&times;</button>
        </div>
      )}

      {error ? (
        <div className="admin-card">
          <div className="p-8 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Người dùng</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Ngày tạo</th>
                  <th className="text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                          user.banned ? 'bg-gradient-to-br from-red-500 to-red-600' :
                          user.role === 'ADMIN' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                          user.role === 'SELLER' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                          'bg-gradient-to-br from-gray-400 to-gray-500'
                        }`}>
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.fullName || '—'}</p>
                          <p className="text-xs text-gray-400">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-gray-500">{user.email}</td>
                    <td className="text-gray-500">{user.phoneNumber || '—'}</td>
                    <td>
                      <span className={roleBadgeClass(user.role, user.banned)}>
                        <span className="admin-badge-dot" />
                        {user.banned ? 'Bị khoá' : roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleString('vi-VN', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' })}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <select
                          value={user.role}
                          onChange={e => handleRoleChange(user.id, e.target.value)}
                          className="admin-select text-xs py-1.5 px-2.5 max-w-[110px]"
                        >
                          <option value="CUSTOMER">Khách hàng</option>
                          <option value="SELLER">Người bán</option>
                          <option value="ADMIN">Quản trị viên</option>
                        </select>
                        <button onClick={() => handleToggleBan(user.id)}
                          className={`admin-btn-icon-sm ${user.banned ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                          title={user.banned ? 'Mở khoá' : 'Khoá tài khoản'}>
                          {user.banned ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4-8v2m-6 4h12a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 012-2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </button>
                        <button onClick={() => { setResetUserId(user.id); setNewPassword('123456'); setNotification(null); }}
                          className="admin-btn-icon-sm text-amber-600 hover:bg-amber-50"
                          title="Reset mật khẩu">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {resetUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { if (!saving) setResetUserId(null); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reset mật khẩu</h3>
            <p className="text-sm text-gray-500 mb-4">Nhập mật khẩu mới cho người dùng ID: <strong>{resetUserId}</strong></p>
            <input
              type="text"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="admin-input w-full mb-6"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setResetUserId(null); setNewPassword('123456'); }}
                disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Huỷ
              </button>
              <button
                onClick={handleResetPassword}
                disabled={saving || !newPassword}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'Đang xử lý...' : 'Xác nhận'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsers;