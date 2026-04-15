import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error(
    "Configuration Supabase manquante: définissez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY (local: .env, GitHub Pages: secrets du repo)."
  );
}

/** Typage des tables : voir `src/types/database.ts` (générer avec Supabase CLI pour du strict). */
export const supabase = createClient(url, anon);
