// Supabase client with safe fallback for static/server environments
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createDummySupabaseClient() {
  const dummyQueryBuilder: any = {
    select: () => dummyQueryBuilder,
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => dummyQueryBuilder,
    delete: () => dummyQueryBuilder,
    eq: () => dummyQueryBuilder,
    neq: () => dummyQueryBuilder,
    order: () => dummyQueryBuilder,
    limit: () => dummyQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: (val: any) => any) => Promise.resolve({ data: [], error: null }).then(resolve),
    catch: (reject: (err: any) => any) => Promise.resolve({ data: [], error: null }).catch(reject),
  };

  return {
    from: () => dummyQueryBuilder,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null }),
    },
  } as unknown as ReturnType<typeof createClient<Database>>;
}

function createSupabaseClient() {
  const envProcess = typeof process !== 'undefined' && process.env ? process.env : {} as Record<string, string | undefined>;
  const SUPABASE_URL = import.meta.env['VITE_SUPABASE_URL'] || envProcess['SUPABASE_URL'] || envProcess['VITE_SUPABASE_URL'];
  const SUPABASE_PUBLISHABLE_KEY = import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] || envProcess['SUPABASE_PUBLISHABLE_KEY'] || envProcess['VITE_SUPABASE_PUBLISHABLE_KEY'];

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    if (typeof console !== 'undefined') {
      console.warn('[Supabase] Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY environment variables. Using safe fallback client.');
    }
    return createDummySupabaseClient();
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
    },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
