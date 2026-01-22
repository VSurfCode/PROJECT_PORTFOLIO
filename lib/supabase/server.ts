import { createClient } from "@supabase/supabase-js";

const getSupabaseConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please check your .env file."
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

export const createServerClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return createClient(supabaseUrl, supabaseAnonKey);
};

export const createAdminClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY;
  const key = serviceRoleKey || supabaseAnonKey;

  return createClient(supabaseUrl, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
