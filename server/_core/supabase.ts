/**
 * Supabase Client Configuration
 * Lex Intel Visual Design - Desenvolvido por Lex Intelligentia
 *
 * Cliente Supabase para operações que não passam pelo Drizzle ORM,
 * como storage, realtime e auth nativo do Supabase.
 */

import { createClient } from "@supabase/supabase-js";
import { loggers } from "./logger";

// Lazy-loaded Supabase client
let _supabaseClient: ReturnType<typeof createClient> | null = null;

/**
 * Retorna o cliente Supabase configurado
 * Usa lazy initialization para evitar erros quando as variáveis não estão definidas
 */
export function getSupabaseClient() {
  if (_supabaseClient) {
    return _supabaseClient;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    loggers.database.warn("Supabase client not configured: missing SUPABASE_URL or SUPABASE_ANON_KEY");
    return null;
  }

  _supabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: false, // Server-side doesn't need session persistence
    },
  });

  loggers.database.info("Supabase client initialized", { url: supabaseUrl });

  return _supabaseClient;
}

/**
 * Retorna o cliente Supabase com service role (admin)
 * Use apenas no servidor para operações privilegiadas
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    loggers.database.warn("Supabase admin client not configured: missing SUPABASE_SERVICE_ROLE_KEY");
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verifica se o Supabase está configurado
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}
