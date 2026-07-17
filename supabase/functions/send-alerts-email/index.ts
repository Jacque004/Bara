import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type TaskRow = {
  id: string;
  title: string;
  deadline: string;
  status: string;
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function formatFrDate(dateISO: string): string {
  const d = new Date(`${dateISO}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateISO;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Non autorisé" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("ALERTS_FROM_EMAIL") ?? "onboarding@resend.dev";

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          error: "RESEND_API_KEY manquant. Ajoutez le secret puis redéployez.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user?.email) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const requestedUserId = body.user_id as string | undefined;
    if (requestedUserId && requestedUserId !== user.id) {
      return new Response(JSON.stringify({ error: "user_id interdit" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: tasks, error: tasksErr } = await supabase
      .from("tasks")
      .select("id, title, deadline, status")
      .eq("user_id", user.id)
      .neq("status", "done")
      .order("deadline", { ascending: true });

    if (tasksErr) throw tasksErr;

    const today = startOfDay(new Date());
    const taskRows = (tasks ?? []) as TaskRow[];

    const overdue = taskRows.filter((t) => {
      const d = new Date(`${t.deadline}T12:00:00`);
      return d.getTime() < today.getTime();
    });

    const soon = taskRows.filter((t) => {
      const d = new Date(`${t.deadline}T12:00:00`);
      const diff = (d.getTime() - today.getTime()) / 86400000;
      return diff >= 0 && diff <= 2;
    });

    const overdueLines =
      overdue.length === 0
        ? "<li>Aucune tâche en retard.</li>"
        : overdue
            .slice(0, 12)
            .map((t) => `<li><strong>${t.title}</strong> - échéance ${formatFrDate(t.deadline)}</li>`)
            .join("");

    const soonLines =
      soon.length === 0
        ? "<li>Aucune tâche proche d'échéance.</li>"
        : soon
            .slice(0, 12)
            .map((t) => `<li><strong>${t.title}</strong> - échéance ${formatFrDate(t.deadline)}</li>`)
            .join("");

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.5; color:#1f2937">
        <h2 style="margin:0 0 8px;">BARA - Alertes & rappels</h2>
        <p style="margin:0 0 16px;">
          Priorité immédiate sur les tâches en retard puis celles proches de l’échéance.
        </p>
        <h3 style="margin:16px 0 8px;">Tâches en retard (${overdue.length})</h3>
        <ul>${overdueLines}</ul>
        <h3 style="margin:16px 0 8px;">Tâches à échéance proche (${soon.length})</h3>
        <ul>${soonLines}</ul>
        <p style="margin-top:20px; color:#6b7280; font-size:12px;">
          Email généré automatiquement par BARA.
        </p>
      </div>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [user.email],
        subject: "BARA - Alertes & rappels",
        html,
      }),
    });

    const resendPayload = await resendRes.json().catch(() => null);
    if (!resendRes.ok) {
      const detail =
        resendPayload && typeof resendPayload === "object" && "message" in resendPayload
          ? String((resendPayload as { message?: unknown }).message ?? "")
          : "Erreur provider email";
      throw new Error(detail);
    }

    return new Response(
      JSON.stringify({ success: true, sent_to: user.email }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
