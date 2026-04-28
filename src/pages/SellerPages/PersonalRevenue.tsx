import React from 'react';
import { Card, CardBody, CardTitle } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockTransactions = [
  { id: 'TXN-101', date: '2026-04-28', description: 'Sold: Netflix Premium 1 Month', amount: 5 },
  { id: 'TXN-102', date: '2026-04-27', description: 'Sold: Spotify Premium 3 Months', amount: 10 },
];

const PersonalRevenue = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Personal Revenue</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary text-primary-content">
          <CardBody>
            <CardTitle>Total Earnings</CardTitle>
            <div className="text-4xl font-bold mt-2">$2,450</div>
          </CardBody>
        </Card>
        <Card className="bg-success text-success-content">
          <CardBody>
            <CardTitle>Available to Withdraw</CardTitle>
            <div className="text-4xl font-bold mt-2">$850</div>
            <div className="mt-4">
              <Button size="sm" className="btn-outline text-success-content">Withdraw</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <CardTitle>Recent Transactions</CardTitle>
          <Table columns={['Transaction ID', 'Date', 'Description', 'Amount ($)']} className="mt-4">
            {mockTransactions.map(({ id, date, description, amount }) => (
              <tr key={id}>
                <td className="font-mono text-sm">{id}</td>
                <td>{date}</td>
                <td>{description}</td>
                <td className="text-success font-semibold">+${amount}</td>
              </tr>
            ))}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default PersonalRevenue;
