import { supabase } from '../supabase';
import { withErrorHandling, withErrorHandlingArray } from '../errorHandler';
import { getProductImages } from './images';

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

export async function getProducts(): Promise<ProductDB[]> {
  return withErrorHandlingArray(
    () => supabase.from('products').select('*').order('created_at', { ascending: false }),
    'Error fetching products'
  );
}

export async function getProduct(id: string): Promise<ProductDB | null> {
  return withErrorHandling(
    () => supabase.from('products').select('*').eq('id', id).maybeSingle(),
    'Error fetching product'
  );
}

export async function createProduct(product: Omit<ProductDB, 'id' | 'created_at' | 'updated_at'>): Promise<ProductDB | null> {
  return withErrorHandling(
    () => supabase.from('products').insert([product]).select().single(),
    'Error creating product'
  );
}

export async function updateProduct(id: string, updates: Partial<ProductDB>): Promise<ProductDB | null> {
  return withErrorHandling(
    () => supabase.from('products').update(updates).eq('id', id).select().single(),
    'Error updating product'
  );
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
