import React, {useEffect, useState} from 'react';
import Header from '../../components/layout/Header';
import CardGrid from './CardGrid';
import CategoryIcons from './CategoryIcons';
import BestSellers from './BestSellers';
import NewProducts from './NewProducts';
import TrustAndStats from './TrustAndStats';
import Footer from '../../components/layout/Footer';
import FloatingActions from '../../components/layout/FloatingActions';

const Home = () => {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        const getAllProduct = async () => {
            try {
                const res = await fetch('http://localhost:8080/api/product/all');
                const data = await res.json();
                setProducts(data);
            } catch(e) {
                console.error("Error: Get All Product", e);
            }
        }

        getAllProduct();
    }, []);

  return (
    <div className="min-h-screen bg-[#F0F4FF] font-sans">
      <Header />
      <main>
        <CardGrid />
        <BestSellers products={products} />
        <NewProducts newProducts={products} />
        <TrustAndStats />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Home;
