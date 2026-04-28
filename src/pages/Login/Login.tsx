import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle } from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'admin@test.com' && password === '123456') {
      navigate('/admin/dashboard');
    } else if (email === 'seller@test.com' && password === '123456') {
      navigate('/seller/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardBody>
          <CardTitle className="justify-center mb-6 text-2xl font-bold">Sign in</CardTitle>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && (
              <div className="text-error text-sm text-center">{error}</div>
            )}
            
            <Button type="submit" className="w-full" variant="primary">
              Sign In
            </Button>
          </form>
          
          <div className="mt-4 text-sm text-base-content/70">
            <p>Mock Admin: <span className="font-semibold text-base-content">admin@test.com</span> / 123456</p>
            <p>Mock Seller: <span className="font-semibold text-base-content">seller@test.com</span> / 123456</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
