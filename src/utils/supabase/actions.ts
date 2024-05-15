// import { type CookieOptions, createServerClient } from '@supabase/ssr';

// export function createClient(cookieStore: ReturnType<any>) {
//   return createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//       cookies: {
//         get(name: string) {
//           return cookieStore.get(name)?.value;
//         },
//         set(name: string, value: string, options: CookieOptions) {
//           return cookieStore.set({ name, value, ...options });
//         },
//         remove(name: string, options: CookieOptions) {
//           return cookieStore.set({ name, value: '', ...options });
//         },
//       },
//     }
//   );
// }
