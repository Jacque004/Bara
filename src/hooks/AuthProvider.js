import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState, } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "./AuthContext";
function appOriginRedirect(path) {
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    return `${window.location.origin}${base}${path.startsWith("/") ? path : `/${path}`}`;
}
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let mounted = true;
        supabase.auth
            .getSession()
            .then(({ data: { session: s } }) => {
            if (!mounted)
                return;
            setSession(s);
            setLoading(false);
        })
            .catch(() => {
            if (!mounted)
                return;
            setLoading(false);
        });
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, s) => {
            setSession(s);
            setLoading(false);
        });
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);
    const signIn = useCallback(async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error };
    }, []);
    const signUp = useCallback(async (email, password) => {
        const { error } = await supabase.auth.signUp({ email, password });
        return { error: error };
    }, []);
    const signInWithGoogle = useCallback(async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: appOriginRedirect("/app"),
            },
        });
        return { error: error };
    }, []);
    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);
    const updatePassword = useCallback(async (password) => {
        const { error } = await supabase.auth.updateUser({ password });
        return { error: error };
    }, []);
    const value = useMemo(() => ({
        user: session?.user ?? null,
        session,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        updatePassword,
    }), [session, loading, signIn, signUp, signInWithGoogle, signOut, updatePassword]);
    return _jsx(AuthContext.Provider, { value: value, children: children });
}
