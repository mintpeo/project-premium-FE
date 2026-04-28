import React from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';
import ProductBanner from './ProductBanner';
import ProductPolicy from './ProductPolicy';
import ProductDescription from './ProductDescription';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';

const ProductDetail = () => {
  return (
    <div className="min-h-screen bg-[#edf3f6] font-sans flex flex-col relative overflow-x-hidden">
      <Header />

      <main className="flex-1 w-full pb-20">
        <ProductBanner />
        
        {/* Content Below Banner */}
        <div className="max-w-[1200px] mx-auto px-4 -mt-10 relative z-20 flex flex-col gap-6">
          <ProductPolicy />
          <ProductDescription />
          <ProductInfo />
          <ProductReviews />
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ProductDetail;
