import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
 
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // ✅ Required for Supabase to read stored tokens
        getAll: () =>
          cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          })),

        // ✅ Required for Supabase to update or clear cookies
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              if (options?.maxAge && options.maxAge <= 0) {
                cookieStore.delete(name);
              } else {
                cookieStore.set(name, value, options);
              }
            } catch {
            }
          });
        },
      },
    }
  );
}
