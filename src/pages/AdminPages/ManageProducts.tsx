import React from 'react';
import { Card, CardBody } from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';

const mockProducts = [
  { id: 'P01', name: 'Netflix Premium 1 Month', category: 'Entertainment', price: 5, stock: 100 },
  { id: 'P02', name: 'Spotify Premium 3 Months', category: 'Music', price: 10, stock: 50 },
  { id: 'P03', name: 'Steam Wallet $50', category: 'Game', price: 45, stock: 20 },
];

const ManageProducts = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Button variant="primary">Add Product</Button>
      </div>
      <Card>
        <CardBody>
          <Table columns={['ID', 'Product Name', 'Category', 'Price ($)', 'Stock', 'Actions']}>
            {mockProducts.map(({ id, name, category, price, stock }) => (
              <tr key={id}>
                <td>{id}</td>
                <td className="font-medium">{name}</td>
                <td>{category}</td>
                <td>${price}</td>
                <td>
                  <span className={`badge ${stock > 0 ? 'badge-ghost' : 'badge-error'} badge-sm`}>
                    {stock}
                  </span>
                </td>
                <td className="space-x-2">
                  <Button size="sm" variant="secondary" className="text-xs">Edit</Button>
                  <Button size="sm" variant="error" className="text-xs">Delete</Button>
                </td>
              </tr>
            ))}
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ManageProducts;
