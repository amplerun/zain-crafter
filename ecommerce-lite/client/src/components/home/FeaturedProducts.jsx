import { Link } from 'react-router-dom';
import ProductCard from '../common/ProductCard';
import { useTheme } from '../../context/ThemeContext';

const FeaturedProducts = ({ products }) => {
  const { theme } = useTheme();

  // Mock data - replace with actual products from props
  const featuredProducts = [
    {
      _id: '1',
      name: 'AIRBRUSH FLAWLESS SETTING SPRAY',
      price: 32,
      discountedPrice: 28,
      images: ['https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=AIRBRUSH+SPRAY'],
      stock: 10,
      features: ['Hydrating', 'Long-lasting']
    },
    {
      _id: '2',
      name: 'HOLLYWOOD FLAWLESS FILTER',
      price: 39,
      images: ['https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=FLAWLESS+FILTER'],
      stock: 15,
      features: ['Glowy', 'Radiant']
    },
    {
      _id: '3',
      name: 'UNISEX HI GLOW',
      price: 39,
      images: ['https://via.placeholder.com/300x300/FFE66D/000000?text=HI+GLOW'],
      stock: 8,
      features: ['Hydrating', 'Unisex']
    },
    {
      _id: '4',
      name: 'ROCK N KOHL LINER',
      price: 25,
      discountedPrice: 20,
      images: ['https://via.placeholder.com/300x300/FF8E8E/FFFFFF?text=ROCK+N+KOHL'],
      stock: 5,
      features: ['Waterproof', 'Long-wear']
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold" style={{ color: theme.primaryColor }}>
            BEST SELLERS
          </h2>
          <Link 
            to="/bestsellers" 
            className="text-sm font-medium hover:underline"
            style={{ color: theme.primaryColor }}
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
