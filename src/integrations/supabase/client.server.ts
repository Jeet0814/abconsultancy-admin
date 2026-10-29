// Server-side Supabase client with service role key - bypasses RLS.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

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

function createDummyAdminClient() {
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
      admin: {
        getUserById: () => Promise.resolve({ data: { user: null }, error: null }),
        listUsers: () => Promise.resolve({ data: { users: [] }, error: null }),
      },
    },
  } as unknown as ReturnType<typeof createClient<Database>>;
}

function createSupabaseAdminClient() {
  const envProcess = typeof process !== 'undefined' && process.env ? process.env : {} as Record<string, string | undefined>;
  const SUPABASE_URL = envProcess['SUPABASE_URL'] || envProcess['VITE_SUPABASE_URL'];
  const SUPABASE_SERVICE_ROLE_KEY = envProcess['SUPABASE_SERVICE_ROLE_KEY'] || envProcess['SUPABASE_PUBLISHABLE_KEY'];

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    if (typeof console !== 'undefined') {
      console.warn('[Supabase Server] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Using safe fallback client.');
    }
    return createDummyAdminClient();
  }

  return createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    global: {
      fetch: createSupabaseFetch(SUPABASE_SERVICE_ROLE_KEY),
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

let _supabaseAdmin: ReturnType<typeof createSupabaseAdminClient> | undefined;

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createSupabaseAdminClient>, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  },
});
