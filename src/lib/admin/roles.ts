import { supabase } from '../supabase';
import { withErrorHandling } from '../errorHandler';

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('user_roles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();
  if (error || !data) return false;

  return data.is_admin;
}

export async function getUserRole(): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return withErrorHandling(
    () => supabase.from('user_roles').select('*').eq('user_id', user.id).maybeSingle(),
    'Error fetching user role'
  );
}
