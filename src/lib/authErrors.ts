/** Messages d’auth plus clairs (429, réseau, etc.). */
export function friendlyAuthError(error: Error | null | undefined): string | null {
  if (!error) return null;
  const raw = error.message || "";
  const lower = raw.toLowerCase();

  if (
    lower.includes("429") ||
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("email rate limit")
  ) {
    return "Trop de tentatives. Attendez 2–5 minutes avant de redemander un e-mail.";
  }

  if (
    lower.includes("400") ||
    lower.includes("redirect") ||
    lower.includes("not allowed") ||
    lower.includes("unsupported")
  ) {
    return "Lien de redirection non autorisé. Dans Supabase → Authentication → URL Configuration, ajoutez https://jacque004.github.io/Bara/**";
  }

  if (
    lower.includes("failed to fetch") ||
    lower.includes("network") ||
    lower.includes("name_not_resolved")
  ) {
    return "Impossible de joindre le serveur. Vérifiez votre connexion ou la configuration Supabase.";
  }

  if (lower.includes("invalid login credentials")) {
    return "E-mail ou mot de passe incorrect.";
  }

  return raw;
}
