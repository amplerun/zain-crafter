import { useEffect, useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import HeroCarousel from '../components/home/HeroCarousel';
import FeaturedProducts from '../components/home/FeaturedProducts';
import CategoryGrid from '../components/home/CategoryGrid';
import api from '../services/api';

const HomePage = () => {
  const [offers, setOffers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersResponse, featuredResponse] = await Promise.all([
          api.get('/products/offers'),
          api.get('/products/featured')
        ]);
        
        setOffers(offersResponse.data);
        setFeaturedProducts(featuredResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <SearchBar />
      </div>
      
      <HeroCarousel offers={offers} />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid />
    </div>
  );
};

export default HomePage;
