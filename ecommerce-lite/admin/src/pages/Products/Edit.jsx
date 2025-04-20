import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductForm from '../../components/ProductForm';
import api from '../../../services/api';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/admin/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await api.put(`/admin/products/${id}`, formData);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return <div className="flex justify-center items-center h-64">Loading product...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Back to Products
        </button>
      </div>
      
      {product && <ProductForm product={product} onSubmit={handleSubmit} />}
    </div>
  );
};

export default EditProduct;
