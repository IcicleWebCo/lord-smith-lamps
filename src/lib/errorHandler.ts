import { PostgrestError } from '@supabase/supabase-js';

export class DatabaseError extends Error {
  constructor(
    message: string,
    public originalError?: PostgrestError | Error,
    public code?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export async function withErrorHandling<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>,
  errorMessage: string
): Promise<T | null> {
  const { data, error } = await operation();

  if (error) {
    console.error(`${errorMessage}:`, error);
    throw new DatabaseError(errorMessage, error, error.code);
  }

  return data;
}

export async function withErrorHandlingArray<T>(
  operation: () => Promise<{ data: T[] | null; error: PostgrestError | null }>,
  errorMessage: string
): Promise<T[]> {
  const { data, error } = await operation();

  if (error) {
    console.error(`${errorMessage}:`, error);
    return [];
  }

  return data || [];
}

export async function withErrorHandlingVoid(
  operation: () => Promise<{ error: PostgrestError | null }>,
  errorMessage: string
): Promise<void> {
  const { error } = await operation();

  if (error) {
    console.error(`${errorMessage}:`, error);
    throw new DatabaseError(errorMessage, error, error.code);
  }
}
