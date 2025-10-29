import React, { useState } from 'react';
import { Package, ImageOff, ChevronRight, Truck, Copy, Check } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  product_image?: string;
}

interface Order {
  id: string;
  order_date: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  status: string;
  tracking_number?: string;
  order_items: OrderItem[];
}

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, loading }) => {
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const copyTrackingNumber = async (trackingNumber: string, orderId: string) => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopiedTrackingId(orderId);
      setTimeout(() => setCopiedTrackingId(null), 2000);
    } catch (err) {
      console.error('Failed to copy tracking number:', err);
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-patina-900 text-patina-400 border-patina-700';
      case 'processing':
      case 'pending':
        return 'bg-ember-900 text-ember-400 border-ember-700';
      case 'shipped':
        return 'bg-gold-900 text-gold-400 border-gold-700';
      case 'cancelled':
        return 'bg-forge-900 text-forge-400 border-forge-700';
      default:
        return 'bg-walnut-800 text-parchment-400 border-walnut-700';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-forge-500 border-t-transparent mb-4"></div>
        <p className="text-parchment-300">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-walnut-800 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Package className="h-12 w-12 text-parchment-600" />
        </div>
        <h3 className="text-2xl font-bold text-parchment-50 mb-3 font-display">No Orders Yet</h3>
        <p className="text-parchment-300 mb-6 max-w-md mx-auto">
          Start exploring our handcrafted lamps and create your first order
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-walnut-800 rounded-xl border-2 border-walnut-700 hover:border-ember-600 transition-all duration-300 overflow-hidden group"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-parchment-50 font-display">
                    Order #{order.id.slice(0, 8)}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-parchment-400">
                  Placed on {formatDate(order.order_date)}
                </p>
                {order.status.toLowerCase() === 'shipped' && order.tracking_number && (
                  <div className="mt-3 flex items-center gap-2 bg-gold-900/30 border border-gold-700 rounded-lg px-3 py-2">
                    <Truck className="h-4 w-4 text-gold-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gold-400 font-semibold mb-0.5">Tracking Number</p>
                      <p className="text-sm text-parchment-50 font-mono truncate">
                        {order.tracking_number}
                      </p>
                    </div>
                    <button
                      onClick={() => copyTrackingNumber(order.tracking_number!, order.id)}
                      className="flex-shrink-0 p-2 hover:bg-gold-800 rounded-lg transition-colors"
                      title="Copy tracking number"
                    >
                      {copiedTrackingId === order.id ? (
                        <Check className="h-4 w-4 text-patina-400" />
                      ) : (
                        <Copy className="h-4 w-4 text-gold-400" />
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-parchment-400 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-ember-400">
                  {formatPrice(order.total_amount)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 items-center bg-walnut-900 rounded-lg p-4 border border-walnut-700 hover:border-walnut-600 transition-colors"
                >
                  <div className="flex-shrink-0 w-20 h-20 bg-walnut-800 rounded-lg overflow-hidden flex items-center justify-center border border-walnut-700">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageOff className="h-8 w-8 text-parchment-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-parchment-50 truncate">
                      {item.product_name}
                    </h5>
                    <div className="flex items-center gap-4 mt-1 text-sm text-parchment-400">
                      <span>Qty: {item.quantity}</span>
                      <span>{formatPrice(item.product_price)} each</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-parchment-400 mb-1">Subtotal</p>
                    <p className="font-bold text-parchment-50">{formatPrice(item.subtotal)}</p>
                  </div>
                </div>
              ))}

              <div className="border-t border-walnut-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Items Subtotal</span>
                  <span className="text-parchment-50 font-semibold">
                    {formatPrice(order.order_items.reduce((sum, item) => sum + item.subtotal, 0))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Shipping</span>
                  <span className="text-parchment-50 font-semibold">
                    {formatPrice(order.shipping_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-parchment-400">Tax</span>
                  <span className="text-parchment-50 font-semibold">
                    {formatPrice(order.tax_amount)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-walnut-700">
                  <span className="text-parchment-50">Order Total</span>
                  <span className="text-ember-400">
                    {formatPrice(order.total_amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
