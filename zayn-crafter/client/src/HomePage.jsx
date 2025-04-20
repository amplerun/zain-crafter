import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import Carousel from '../../components/Carousel';
import axios from 'axios';
import '../../styles/HomePage.css';
const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featuredRes, bestsellersRes, newRes] = await Promise.all([
          axios.get('/api/products/featured'),
          axios.get('/api/products/bestsellers'),
          axios.get('/api/products/new')
        ]);
        setFeaturedProducts(featuredRes.data);
        setBestsellers(bestsellersRes.data);
        setNewArrivals(newRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);
  if (loading) return <div className=\"loading-spinner\">Loading...</div>;
  return (
    <div className=\"homepage\">
      <section className=\"search-section\">
        <input 
          type=\"text\" 
          placeholder=\"Search product, shade, colour\" 
          className=\"search-input\"
        />
      </section>
      <section className=\"featured-section\">
        <h2>FEATURED PRODUCTS</h2>
        <Carousel items={featuredProducts} />
      </section>
      <section className=\"bestsellers-section\">
        <h2>BEST SELLERS</h2>
        <div className=\"products-grid\">
          {bestsellers.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
      <section className=\"new-arrivals-section\">
        <h2>NEW ARRIVALS</h2>
        <div className=\"products-grid\">
          {newArrivals.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
export default HomePage;
