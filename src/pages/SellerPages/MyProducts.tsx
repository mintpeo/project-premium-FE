import React from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockSellingProducts = [
  { id: 'SP01', name: 'Netflix Premium 1 Month', price: 5, stock: 100, status: 'Active' },
  { id: 'SP02', name: 'Spotify Premium 3 Months', price: 10, stock: 0, status: 'Out of Stock' },
];

const MyProducts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Products</h1>
        <Button variant="primary">Add New Item</Button>
      </div>
      <Card>
        <CardBody>
          <Table columns={['ID', 'Product Name', 'Price ($)', 'Stock', 'Status', 'Actions']}>
            {mockSellingProducts.map(({ id, name, price, stock, status }) => (
              <tr key={id}>
                <td>{id}</td>
                <td className="font-medium">{name}</td>
                <td>${price}</td>
                <td>{stock}</td>
                <td>
                  <span className={`badge ${stock > 0 ? 'badge-success' : 'badge-error'} badge-sm`}>
                    {status}
                  </span>
                </td>
                <td className="space-x-2">
                  <Button size="sm" variant="secondary" className="text-xs">Edit</Button>
                </td>
              </tr>
            ))}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default MyProducts;
