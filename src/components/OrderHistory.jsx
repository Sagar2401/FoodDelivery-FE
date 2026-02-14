import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Package, Clock, Truck, CheckCircle2 } from 'lucide-react';

const statusConfig = {
  'Order Received': {
    icon: Package,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  'Preparing': {
    icon: Clock,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  'Out for Delivery': {
    icon: Truck,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  'Delivered': {
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
};

const OrderHistory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await orderService.getHistory();
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading order history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500 mb-4">No orders yet</p>
            <Button onClick={() => navigate('/')}>Browse Menu</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status] || statusConfig['Order Received'];
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={order._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order._id.slice(-8)}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className={`${statusInfo.bgColor} ${statusInfo.color} px-3 py-1 rounded-full flex items-center gap-2`}>
                      <StatusIcon className="h-4 w-4" />
                      <span className="text-sm font-medium">{order.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Address:</span>
                      <span className="font-medium">{order.customerAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-xl font-bold text-green-600">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
