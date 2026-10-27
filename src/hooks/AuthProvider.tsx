import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session } from "@supabase/supabase-js";
import { GDPR_PENDING_KEY, gdprAcceptancePayload, hasGdprAcceptance } from "@/lib/gdpr";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "./AuthContext";

function appOriginRedirect(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${window.location.origin}${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data: { session: s } }) => {
        if (!mounted) return;
        setSession(s);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setLoading(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const pending = sessionStorage.getItem(GDPR_PENDING_KEY);
    const current = session?.user;
    if (!pending || !current) return;
    if (hasGdprAcceptance(current.user_metadata)) {
      sessionStorage.removeItem(GDPR_PENDING_KEY);
      return;
    }
    let cancelled = false;
    void supabase.auth
      .updateUser({ data: gdprAcceptancePayload(pending) })
      .then(({ error }) => {
        if (!cancelled && !error) sessionStorage.removeItem(GDPR_PENDING_KEY);
      });
    return () => {
      cancelled = true;
    };
  }, [session]);

  const signIn = useCallback(async (email: string, password: string) => {
    sessionStorage.removeItem(GDPR_PENDING_KEY);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: gdprAcceptancePayload() },
    });
    return { error: error as Error | null };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    sessionStorage.setItem(GDPR_PENDING_KEY, new Date().toISOString());
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: appOriginRedirect("/app"),
      },
    });
    if (error) sessionStorage.removeItem(GDPR_PENDING_KEY);
    return { error: error as Error | null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: error as Error | null };
  }, []);

  const updateEmail = useCallback(async (email: string) => {
    const { error } = await supabase.auth.updateUser(
      { email },
      { emailRedirectTo: appOriginRedirect("/app/profil") }
    );
    return { error: error as Error | null };
  }, []);

  const acceptGdpr = useCallback(async () => {
    const { error } = await supabase.auth.updateUser({ data: gdprAcceptancePayload() });
    return { error: error as Error | null };
  }, []);

  const restrictProcessing = useCallback(async () => {
    const { error } = await supabase.auth.updateUser({
      data: { processing_restricted_at: new Date().toISOString() },
    });
    return { error: error as Error | null };
  }, []);

  const liftProcessingRestriction = useCallback(async () => {
    const { error } = await supabase.auth.updateUser({
      data: { processing_restricted_at: "" },
    });
    return { error: error as Error | null };
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updatePassword,
      updateEmail,
      acceptGdpr,
      restrictProcessing,
      liftProcessingRestriction,
    }),
    [
      session,
      loading,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      updatePassword,
      updateEmail,
      acceptGdpr,
      restrictProcessing,
      liftProcessingRestriction,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
