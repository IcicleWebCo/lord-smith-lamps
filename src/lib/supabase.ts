import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication functions
export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  return user;
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?mode=reset`,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const updatePassword = async (newPassword: string) => {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Newsletter subscription function
export const subscribeToNewsletter = async (email: string) => {
  const { data, error } = await supabase
    .from('newsletter_subscriptions')
    .insert([{ email }])
    .select();

  if (error) {
    // Handle duplicate email error gracefully
    if (error.code === '23505') {
      throw new Error('This email is already subscribed to our newsletter.');
    }
    throw new Error('Failed to subscribe. Please try again.');
  }

  return data;
};
// Contact form submission function
export const submitContactForm = async (formData: {
  name: string;
  email: string;
  message: string;
}) => {
  console.log('[submitContactForm] Starting insert with data:', formData);

  const { data, error } = await supabase
    .from('contact_submissions')
    .insert([formData])
    .select();

  if (error) {
    console.error('[submitContactForm] Supabase error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw new Error(error.message || 'Failed to submit your message. Please try again.');
  }

  console.log('[submitContactForm] Insert successful:', data);
  return data;
};