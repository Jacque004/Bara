import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updatePassword: (password: string) => Promise<{ error: Error | null }>;
  updateEmail: (email: string) => Promise<{ error: Error | null }>;
  acceptGdpr: () => Promise<{ error: Error | null }>;
  restrictProcessing: () => Promise<{ error: Error | null }>;
  liftProcessingRestriction: () => Promise<{ error: Error | null }>;
};

export const AuthContext = createContext<AuthState | null>(null);
