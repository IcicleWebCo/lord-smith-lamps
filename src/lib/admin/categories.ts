import { supabase } from '../supabase';
import { withErrorHandling, withErrorHandlingArray, withErrorHandlingVoid } from '../errorHandler';

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export async function getCategories(): Promise<Category[]> {
  return withErrorHandlingArray(
    () => supabase.from('categories').select('*').order('name'),
    'Error fetching categories'
  );
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> {
  return withErrorHandling(
    () => supabase.from('categories').insert([category]).select().single(),
    'Error creating category'
  );
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  return withErrorHandling(
    () => supabase.from('categories').update(updates).eq('id', id).select().single(),
    'Error updating category'
  );
}

export async function deleteCategory(id: string): Promise<void> {
  return withErrorHandlingVoid(
    () => supabase.from('categories').delete().eq('id', id),
    'Error deleting category'
  );
}
