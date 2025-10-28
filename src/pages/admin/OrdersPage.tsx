import React, { useState, useEffect } from 'react';
import { Package, Truck, Calendar, User, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { getOrders, toggleOrderShipped, type OrderWithDetails } from '../../lib/admin';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const data = await getOrders();
    setOrders(data);
    setLoading(false);
  };

  const handleToggleShipped = async (orderId: string, currentStatus: boolean) => {
    try {
      await toggleOrderShipped(orderId, !currentStatus);
      await loadOrders();
    } catch (error) {
      console.error('Error toggling shipped status:', error);
      alert('Failed to update order status');
    }
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-parchment-300">Loading orders...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-parchment-50 font-display">Orders</h1>
        <p className="text-parchment-300 mt-2">Manage customer orders and shipping</p>
      </div>

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg overflow-hidden">
        <div className="divide-y divide-walnut-800">
          {currentOrders.length === 0 ? (
            <div className="p-8 text-center text-parchment-400">
              No orders found
            </div>
          ) : (
            currentOrders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-walnut-850 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-forge-400" />
                      <span className="text-sm font-medium text-parchment-200">Order Details</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      <p className="text-xs text-parchment-400">
                        Order ID: <span className="text-parchment-300 font-mono">{order.id.slice(0, 8)}</span>
                      </p>
                      <p className="text-xs text-parchment-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-parchment-50">
                        ${parseFloat(order.total_amount).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed'
                            ? 'bg-green-900/30 text-green-400 border border-green-800'
                            : 'bg-copper-900/30 text-copper-400 border border-copper-800'
                        }`}>
                          {order.status}
                        </span>
                        {order.shipped && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-900/30 text-blue-400 border border-blue-800 flex items-center gap-1">
                            <Truck className="h-3 w-3" />
                            Shipped
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-copper-400" />
                      <span className="text-sm font-medium text-parchment-200">Customer & Shipping</span>
                    </div>
                    {order.shipping_address ? (
                      <div className="pl-6 space-y-1">
                        <p className="text-sm font-medium text-parchment-300">{order.shipping_address.full_name}</p>
                        <p className="text-xs text-parchment-400">{order.shipping_address.address_line1}</p>
                        {order.shipping_address.address_line2 && (
                          <p className="text-xs text-parchment-400">{order.shipping_address.address_line2}</p>
                        )}
                        <p className="text-xs text-parchment-400">
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                        </p>
                        {order.shipping_address.phone && (
                          <p className="text-xs text-parchment-400">{order.shipping_address.phone}</p>
                        )}
                        {order.shipping_address.special_instructions && (
                          <p className="text-xs text-patina-400 italic mt-2">
                            Note: {order.shipping_address.special_instructions}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="pl-6 text-xs text-parchment-500">
                        No shipping address on file
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-timber-400" />
                      <span className="text-sm font-medium text-parchment-200">Items</span>
                    </div>
                    <div className="pl-6 space-y-2">
                      {order.order_items && order.order_items.length > 0 ? (
                        <>
                          {order.order_items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-parchment-300 truncate">{item.product_name}</p>
                                <p className="text-xs text-parchment-500">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-xs text-parchment-300 whitespace-nowrap">
                                ${parseFloat(item.subtotal).toFixed(2)}
                              </p>
                            </div>
                          ))}
                          <button
                            onClick={() => handleToggleShipped(order.id, order.shipped)}
                            className={`mt-3 w-full px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                              order.shipped
                                ? 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700 border border-walnut-700'
                                : 'bg-forge-600 text-parchment-50 hover:bg-forge-700'
                            }`}
                          >
                            <Truck className="h-3 w-3" />
                            {order.shipped ? 'Mark as Unshipped' : 'Mark as Shipped'}
                          </button>
                        </>
                      ) : (
                        <p className="text-xs text-parchment-500">No items</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="border-t border-walnut-800 p-4 flex items-center justify-between">
            <div className="text-sm text-parchment-400">
              Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-parchment-300 hover:bg-walnut-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-parchment-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-parchment-300 hover:bg-walnut-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
