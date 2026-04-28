import React from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockOrders = [
  { id: 'ORD-1021', buyer: 'john@example.com', total: 15, status: 'Completed', date: '2026-04-28' },
  { id: 'ORD-1022', buyer: 'mike@example.com', total: 45, status: 'Pending', date: '2026-04-28' },
];

const ManageOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Orders</h1>
      </div>
      <Card>
        <CardBody>
          <Table columns={['Order ID', 'Date', 'Buyer', 'Total ($)', 'Status', 'Actions']}>
            {mockOrders.map(({ id, date, buyer, total, status }) => (
              <tr key={id}>
                <td className="font-mono text-sm">{id}</td>
                <td>{date}</td>
                <td>{buyer}</td>
                <td>${total}</td>
                <td>
                  <span className={`badge ${status === 'Completed' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                    {status}
                  </span>
                </td>
                <td className="space-x-2">
                  <Button size="sm" variant="ghost" className="text-xs">View Details</Button>
                </td>
              </tr>
            ))}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageOrders;
