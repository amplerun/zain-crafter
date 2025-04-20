import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductCard from '../components/common/ProductCard';
import api from '../services/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/products?search=${query}`);
        setResults(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to search products');
      } finally {
        setLoading(false);
      }
    };
    
    searchProducts();
  }, [query]);

  if (!query) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No search query provided</h2>
          <p className="text-gray-600">Please enter a search term to find products</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Searching...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>
        
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No products found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
