import { createClient, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !anonKey) {
  throw new Error("Supabase environment variables are not set");
}

const options = { auth: { persistSession: false } } as const;

let adminClient: SupabaseClient | undefined;
let anonClient: SupabaseClient | undefined;

export function getSupabaseAdmin() {
  if (!adminClient) {
    const key = serviceKey || anonKey;
    adminClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }
  return adminClient;
}

export function getSupabaseClient() {
  if (!anonClient) {
    anonClient = createClient(url, anonKey, options);
  }
  return anonClient;
}
