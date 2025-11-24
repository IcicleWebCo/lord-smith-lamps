import { supabase } from '../supabase';
import { withErrorHandling, withErrorHandlingArray, withErrorHandlingVoid } from '../errorHandler';

export interface NewsletterSubscription {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
}

export async function getSubscriptions(): Promise<NewsletterSubscription[]> {
  return withErrorHandlingArray(
    () => supabase.from('newsletter_subscriptions').select('*').order('subscribed_at', { ascending: false }),
    'Error fetching subscriptions'
  );
}

export async function updateSubscription(id: string, updates: Partial<NewsletterSubscription>): Promise<NewsletterSubscription | null> {
  return withErrorHandling(
    () => supabase.from('newsletter_subscriptions').update(updates).eq('id', id).select().single(),
    'Error updating subscription'
  );
}

export async function deleteSubscription(id: string): Promise<void> {
  return withErrorHandlingVoid(
    () => supabase.from('newsletter_subscriptions').delete().eq('id', id),
    'Error deleting subscription'
  );
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
