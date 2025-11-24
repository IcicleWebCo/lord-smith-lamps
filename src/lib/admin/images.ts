import { supabase } from '../supabase';
import { createThumbnail, fileFromBlob } from '../imageUtils';
import { withErrorHandling, withErrorHandlingArray } from '../errorHandler';

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

export async function getProductImages(productId: string): Promise<ProductImage[]> {
  return withErrorHandlingArray(
    () => supabase.from('product_images').select('*').eq('product_id', productId).order('seq'),
    'Error fetching product images'
  );
}

export async function createProductImage(image: Omit<ProductImage, 'id' | 'created_at' | 'updated_at'>): Promise<ProductImage | null> {
  return withErrorHandling(
    () => supabase.from('product_images').insert([image]).select().single(),
    'Error creating product image'
  );
}

export async function updateProductImage(id: string, updates: Partial<ProductImage>): Promise<ProductImage | null> {
  return withErrorHandling(
    () => supabase.from('product_images').update(updates).eq('id', id).select().single(),
    'Error updating product image'
  );
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
