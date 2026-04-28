import React from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockSellerOrders = [
  { id: 'ORD-1021', product: 'Netflix Premium 1 Month', buyer: 'john@example.com', status: 'Pending Delivery', date: '2026-04-28' },
  { id: 'ORD-1022', product: 'Spotify Premium 3 Months', buyer: 'mike@example.com', status: 'Completed', date: '2026-04-28' },
];

const ProcessOrders = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Process Orders</h1>
      </div>
      <Card>
        <CardBody>
          <Table columns={['Order ID', 'Date', 'Product', 'Buyer', 'Status', 'Actions']}>
            {mockSellerOrders.map(({ id, date, product, buyer, status }) => (
              <tr key={id}>
                <td className="font-mono text-sm">{id}</td>
                <td>{date}</td>
                <td>{product}</td>
                <td>{buyer}</td>
                <td>
                  <span className={`badge ${status === 'Completed' ? 'badge-success' : 'badge-warning'} badge-sm`}>
                    {status}
                  </span>
                </td>
                <td className="space-x-2">
                  <Button 
                    size="sm" 
                    variant={status === 'Completed' ? 'ghost' : 'primary'} 
                    className="text-xs"
                    disabled={status === 'Completed'}
                  >
                    {status === 'Completed' ? 'Delivered' : 'Deliver Now'}
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

export default ProcessOrders;
