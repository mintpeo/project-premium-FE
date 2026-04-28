import React from 'react';
import { Card, CardBody, CardTitle } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Buyer', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Seller', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Buyer', status: 'Locked' },
];

const ManageUsers = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <Button variant="primary">Add User</Button>
      </div>
      <Card>
        <CardBody>
          <Table columns={['ID', 'Name', 'Email', 'Role', 'Status', 'Actions']}>
            {mockUsers.map(({ id, name, email, role, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td>{role}</td>
                <td>
                  <span className={`badge ${status === 'Active' ? 'badge-success' : 'badge-error'} badge-sm`}>
                    {status}
                  </span>
                </td>
                <td className="space-x-2">
                  <Button size="sm" variant={status === 'Active' ? 'error' : 'primary'} className="text-xs">
                    {status === 'Active' ? 'Lock' : 'Unlock'}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageUsers;
