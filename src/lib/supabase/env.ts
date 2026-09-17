// process.env.NEXT_PUBLIC_* must be referenced as static property access
// (not a dynamic lookup) so Next.js can inline the value at build time for
// the browser bundle.

export function requireSupabaseUrl(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL. Copy .env.local.example to .env.local and fill in your Supabase project's values (see README.md).",
    );
  }
  return value;
}

export function requireSupabaseAnonKey(): string {
  const value = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!value) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY. Copy .env.local.example to .env.local and fill in your Supabase project's values (see README.md).",
    );
  }
  return value;
}
