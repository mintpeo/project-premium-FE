import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const useAddToCart = () => {
  const navigate = useNavigate();
  const { openCart } = useCart();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<number | null>(null);

  const addToCart = async (productId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();

    const userData = localStorage.getItem('auth_user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    const user = JSON.parse(userData);

    setLoadingId(productId);
    try {
      const res = await fetch('http://localhost:8080/api/cart/addToCart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          productId,
          quantity: 1,
          duration: '',
          typeUser: '',
        }),
      });
      if (res.ok) {
        setAddedId(productId);
        setTimeout(() => setAddedId(null), 1500);
        openCart(); // Mở cart sidebar sau khi thêm thành công
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return { addToCart, loadingId, addedId };
};

export default useAddToCart;
