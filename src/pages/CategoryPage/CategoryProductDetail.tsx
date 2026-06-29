import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';
import ProductPolicy from '../ProductDetail/ProductPolicy';
import ProductDescription from '../ProductDetail/ProductDescription';
import ProductInfo from '../ProductDetail/ProductInfo';
import ProductReviews from '../ProductDetail/ProductReviews';
import CategoryProductBanner from './CategoryProductBanner';

const CategoryProductDetail = () => {
  const { category, productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/product/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching category product:', error);
      }
    };
    fetchProduct();
  }, [category, productId]);

  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full pb-20">
        <CategoryProductBanner product={product} category={category} />

        <div className="max-w-[1200px] mx-auto px-4 -mt-10 relative z-20 flex flex-col gap-6">
          <ProductPolicy />
          <ProductDescription />
          <ProductInfo />
          <ProductReviews productId={Number(productId)} />
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default CategoryProductDetail;
