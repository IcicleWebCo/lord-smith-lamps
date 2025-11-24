import { supabase } from '../supabase';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
  created_at: string;
}

export interface ShippingAddress {
  id: string;
  user_id: string;
  full_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  special_instructions: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrderWithDetails {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: string;
  subtotal_amount: string;
  tax_amount: string;
  shipping_amount: string;
  stripe_payment_intent_id: string;
  status: string;
  shipped: boolean;
  shipped_at: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  shipping_address: ShippingAddress | null;
}

export async function getOrders(): Promise<OrderWithDetails[]> {
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('order_date', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    return [];
  }

  if (!ordersData || ordersData.length === 0) {
    return [];
  }

  const ordersWithDetails = await Promise.all(
    ordersData.map(async (order) => {
      const { data: itemsData } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);

      const { data: addressData } = await supabase
        .from('shipping_addresses')
        .select('*')
        .eq('user_id', order.user_id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        ...order,
        order_items: itemsData || [],
        shipping_address: addressData || null,
      };
    })
  );

  return ordersWithDetails;
}

export async function getUserEmailByOrderId(orderId: string): Promise<string | null> {
  const { data, error } = await supabase.rpc('get_user_email_by_order', { order_id: orderId });

  if (error) {
    console.error('Error fetching user email:', error);
    return null;
  }

  return data || null;
}

export async function toggleOrderShipped(orderId: string, shipped: boolean, trackingNumber?: string): Promise<void> {
  const updates: { shipped: boolean; shipped_at?: string | null; tracking_number?: string | null } = {
    shipped,
  };

  if (shipped) {
    updates.shipped_at = new Date().toISOString();
    updates.tracking_number = trackingNumber || null;
  } else {
    updates.shipped_at = null;
    updates.tracking_number = null;
  }

  const { error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order shipped status:', error);
    throw error;
  }
}
