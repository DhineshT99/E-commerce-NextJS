// lib/supabase-server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// FIX: Change function to async to allow 'await' on cookies()
export async function createSupabaseServerClient() {
  
  // FIX: Use 'await' to resolve the Promise and get the cookie store object
  const cookieStore = await cookies(); 

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          // convert ReadonlyRequestCookies to plain array Supabase expects
          // FIX: cookieStore is now the resolved object, so .getAll() works
          return cookieStore.getAll().map((c) => ({
            name: c.name,
            value: c.value,
          }));
        },
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            // FIX: cookieStore is now the resolved object, so .set() works
            // Additionally, using options for proper session management
            if (options.maxAge && options.maxAge <= 0) {
              cookieStore.delete(name);
            } else {
              cookieStore.set(name, value, options);
            }
          });
        },
      },
    }
  );
}