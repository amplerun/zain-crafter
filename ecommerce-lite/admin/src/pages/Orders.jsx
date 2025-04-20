import { useState, useEffect } from 'react';
import OrderTable from '../../components/OrderTable';
import api from '../../../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/orders');
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoading(true);
      await api.put(`/admin/orders/${orderId}`, { status });
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status } : order
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  if (loading && orders.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading orders...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      
      {orders.length > 0 ? (
        <OrderTable orders={orders} onUpdateStatus={updateOrderStatus} />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      )}
    </div>
  );
};

export default Orders;
