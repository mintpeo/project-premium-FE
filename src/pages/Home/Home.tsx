import React from 'react';
import Header from '../../components/layout/Header';
import CardGrid from './CardGrid';
import CategoryIcons from './CategoryIcons';
import BestSellers from './BestSellers';
import NewProducts from './NewProducts';
import TrustAndStats from './TrustAndStats';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#F0F4FF] font-sans">
      <Header />
      <main>
        <CardGrid />
        <CategoryIcons />
        <BestSellers />
        <NewProducts />
        <TrustAndStats />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Home;
