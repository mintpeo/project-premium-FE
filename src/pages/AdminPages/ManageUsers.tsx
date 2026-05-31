import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/users');
      if (!res.ok) throw new Error('Không thể tải danh sách người dùng');
      setUsers(await res.json());
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

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase();
  };

  const roleBadgeClass = (role: string) => {
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
    <div className="space-y-8">
      <div className="admin-page-header">
        <div className="admin-page-title">
          <div className="accent-dot" />
          <h1>Quản lý người dùng</h1>
          <span className="admin-page-count">{users.length} người dùng</span>
        </div>
      </div>

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
                      <span className={roleBadgeClass(user.role)}>
                        <span className="admin-badge-dot" />
                        {roleLabels[user.role] || user.role}
                      </span>
                    </td>
                    <td className="text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="text-right">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, e.target.value)}
                        className="admin-select text-xs py-1.5 px-2.5 max-w-[130px]"
                      >
                        <option value="CUSTOMER">Khách hàng</option>
                        <option value="SELLER">Người bán</option>
                        <option value="ADMIN">Quản trị viên</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;