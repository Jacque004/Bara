export function isProcessingRestricted(meta: unknown): boolean {
  if (!meta || typeof meta !== "object") return false;
  const value = (meta as { processing_restricted_at?: unknown }).processing_restricted_at;
  return typeof value === "string" && value.length > 0;
}

export function restrictedResponse(corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify({
      error:
        "Traitement limité sur ce compte. Levez la limitation pour utiliser cette fonction.",
    }),
    {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}
