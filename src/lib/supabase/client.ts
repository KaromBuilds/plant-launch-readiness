import { createBrowserClient } from "@supabase/ssr";
import { requireSupabaseAnonKey, requireSupabaseUrl } from "@/lib/supabase/env";
import type { Database } from "@/lib/supabase/types";

export function createClient() {
  return createBrowserClient<Database>(
    requireSupabaseUrl(),
    requireSupabaseAnonKey(),
  );
}
