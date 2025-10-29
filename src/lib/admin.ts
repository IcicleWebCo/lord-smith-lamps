import { supabase } from './supabase';
import { createThumbnail, fileFromBlob } from './imageUtils';

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductDB {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string;
  category_id: string | null;
  rating: number;
  reviews: number;
  in_stock: boolean;
  quantity: number;
  featured: boolean;
  on_sale: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export async function checkIsAdmin(): Promise<boolean> {
  console.log('checking for admin');
  const { data: { user } } = await supabase.auth.getUser();
  console.log(user);
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_roles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();
  console.log(data);
  if (error || !data) return false;

  return data.is_admin;
}

export async function getUserRole(): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user role:', error);
    return null;
  }

  return data;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();

  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }

  return data;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }

  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}

export async function getProducts(): Promise<ProductDB[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProduct(id: string): Promise<ProductDB | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function createProduct(product: Omit<ProductDB, 'id' | 'created_at' | 'updated_at'>): Promise<ProductDB | null> {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error);
    throw error;
  }

  return data;
}

export async function updateProduct(id: string, updates: Partial<ProductDB>): Promise<ProductDB | null> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }

  return data;
}

function extractStoragePath(imageUrl: string): string | null {
  const urlParts = imageUrl.split('/');
  const bucketIndex = urlParts.findIndex(part => part === 'Product%20Images' || part === 'Product Images');

  if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    return decodeURIComponent(filePath);
  }

  return null;
}

async function deleteImageFromStorage(imageUrl: string, thumbnailUrl?: string): Promise<void> {
  const pathsToDelete: string[] = [];

  const storagePath = extractStoragePath(imageUrl);
  if (storagePath) {
    pathsToDelete.push(storagePath);
  }

  if (thumbnailUrl && thumbnailUrl !== imageUrl) {
    const thumbnailPath = extractStoragePath(thumbnailUrl);
    if (thumbnailPath) {
      pathsToDelete.push(thumbnailPath);
    }
  }

  if (pathsToDelete.length > 0) {
    const { error } = await supabase.storage
      .from('Product Images')
      .remove(pathsToDelete);

    if (error) {
      console.error('Error deleting images from storage:', error);
    }
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const images = await getProductImages(id);

  for (const image of images) {
    if (image.image_url) {
      await deleteImageFromStorage(image.image_url, image.thumbnail_url);
    }
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    if (error.code === '23503') {
      throw new Error('Cannot delete product: it has been ordered by customers. Products with existing orders cannot be deleted.');
    }
    throw error;
  }
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export async function getSubscriptions(): Promise<NewsletterSubscription[]> {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*')
    .order('subscribed_at', { ascending: false });

  if (error) {
    console.error('Error fetching subscriptions:', error);
    return [];
  }

  return data || [];
}

export async function updateSubscription(id: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterSubscription | null> {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }

  return data;
}

export async function deleteSubscription(id: string): Promise<void> {
  const { error } = await supabase
    .from('newsletter_subscriptions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
}

export async function getSubscriptionCount(): Promise<number> {
  const { count, error } = await supabase
    .from('newsletter_subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching subscription count:', error);
    return 0;
  }

  return count || 0;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  thumbnail_url: string;
  seq: number;
  alt_text: string;
  created_at: string;
  updated_at: string;
}

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  const { data, error } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', productId)
    .order('seq');

  if (error) {
    console.error('Error fetching product images:', error);
    return [];
  }

  return data || [];
}

export async function createProductImage(image: Omit<ProductImage, 'id' | 'created_at' | 'updated_at'>): Promise<ProductImage | null> {
  const { data, error } = await supabase
    .from('product_images')
    .insert([image])
    .select()
    .single();

  if (error) {
    console.error('Error creating product image:', error);
    throw error;
  }

  return data;
}

export async function updateProductImage(id: string, updates: Partial<ProductImage>): Promise<ProductImage | null> {
  const { data, error } = await supabase
    .from('product_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product image:', error);
    throw error;
  }

  return data;
}

export async function deleteProductImage(id: string): Promise<void> {
  const { data: image, error: fetchError } = await supabase
    .from('product_images')
    .select('image_url, thumbnail_url')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching product image:', fetchError);
    throw fetchError;
  }

  if (image?.image_url) {
    await deleteImageFromStorage(image.image_url, image.thumbnail_url);
  }

  const { error } = await supabase
    .from('product_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product image:', error);
    throw error;
  }
}

export async function uploadProductImage(file: File): Promise<{ imageUrl: string; thumbnailUrl: string }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('Product Images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('Product Images')
    .getPublicUrl(filePath);

  const thumbnailBlob = await createThumbnail(file, {
    maxWidth: 400,
    maxHeight: 400,
    quality: 0.85,
  });

  const thumbnailFileName = `${Math.random().toString(36).substring(2)}-${Date.now()}-thumb.jpg`;
  const thumbnailPath = `products/thumbnails/${thumbnailFileName}`;
  const thumbnailFile = fileFromBlob(thumbnailBlob, thumbnailFileName);

  const { error: thumbnailUploadError } = await supabase.storage
    .from('Product Images')
    .upload(thumbnailPath, thumbnailFile);

  if (thumbnailUploadError) {
    console.error('Error uploading thumbnail:', thumbnailUploadError);
    return { imageUrl: data.publicUrl, thumbnailUrl: data.publicUrl };
  }

  const { data: thumbnailData } = supabase.storage
    .from('Product Images')
    .getPublicUrl(thumbnailPath);

  return { imageUrl: data.publicUrl, thumbnailUrl: thumbnailData.publicUrl };
}

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
