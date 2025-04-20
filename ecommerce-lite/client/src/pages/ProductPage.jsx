import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductGallery from '../components/product/ProductGallery';
import AddToCart from '../components/product/AddToCart';
import api from '../services/api';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <ProductGallery images={product.images} />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  i < 4 ? <span key={i}>★</span> : <span key={i}>☆</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">(24 reviews)</span>
            </div>
            
            {product.discountedPrice ? (
              <div className="flex items-center mb-6">
                <span className="text-2xl font-bold mr-3">${product.discountedPrice.toFixed(2)}</span>
                <span className="text-lg text-gray-500 line-through">${product.price.toFixed(2)}</span>
                <span className="ml-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  Sale
                </span>
              </div>
            ) : (
              <div className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</div>
            )}
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="flex flex-wrap gap-2">
                {product.features.map((feature, index) => (
                  <li 
                    key={index} 
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <AddToCart product={product} />
          </div>
        </div>
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="prose max-w-none">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
            <p>Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
