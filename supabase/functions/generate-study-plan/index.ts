import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type TaskRow = {
  id: string;
  user_id: string;
  deadline: string;
  estimated_hours: number;
  difficulty: number;
  status: string;
};

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** priority_score = (difficulty × 2 + urgence) − progression */
function computePriority(
  task: TaskRow,
  completedMinutes: number,
  today: Date
): number {
  const deadline = new Date(task.deadline + "T12:00:00");
  const msPerDay = 86400000;
  const daysUntil = Math.max(
    0,
    Math.ceil((deadline.getTime() - today.getTime()) / msPerDay)
  );
  const urgence = 10 / Math.max(1, daysUntil + 0.5);
  const estMin = Math.max(1, task.estimated_hours * 60);
  const progression = Math.min(5, (completedMinutes / estMin) * 5);
  return task.difficulty * 2 + urgence - progression;
}

const DEFAULT_SLOT_MIN = 25;
const DEFAULT_MAX_MIN_PER_DAY = 180;
const HORIZON_DAYS = 21;

function parsePositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.floor(value);
    return n > 0 ? n : null;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }
  return null;
}

function parseStartDate(value: unknown): Date | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const d = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  d.setHours(0, 0, 0, 0);
  return d;
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
    const supabase = createClient(supabaseUrl, supabaseAnon, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
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

    const userId = user.id;
    const requestedSlotMin = parsePositiveInt(body.session_minutes);
    const requestedDailyMax = parsePositiveInt(body.daily_minutes_limit);
    const requestedStartDate = parseStartDate(body.start_date);

    const slotMin = Math.max(
      DEFAULT_SLOT_MIN,
      requestedSlotMin ?? DEFAULT_SLOT_MIN
    );
    const maxMinPerDay = Math.max(
      slotMin,
      requestedDailyMax ?? DEFAULT_MAX_MIN_PER_DAY
    );
    const today = requestedStartDate ?? new Date();
    today.setHours(0, 0, 0, 0);

    const { data: tasks, error: tasksErr } = await supabase
      .from("tasks")
      .select("id, user_id, deadline, estimated_hours, difficulty, status")
      .eq("user_id", userId)
      .neq("status", "done");

    if (tasksErr) throw tasksErr;

    const taskList = (tasks ?? []) as TaskRow[];
    if (taskList.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aucune tâche à planifier", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const taskIds = taskList.map((t) => t.id);
    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("task_id, duration_minutes")
      .eq("user_id", userId)
      .in("task_id", taskIds);

    const minutesByTask = new Map<string, number>();
    for (const s of sessions ?? []) {
      const tid = s.task_id as string;
      minutesByTask.set(
        tid,
        (minutesByTask.get(tid) ?? 0) + (s.duration_minutes as number)
      );
    }

    const scored = taskList.map((t) => {
      const done = minutesByTask.get(t.id) ?? 0;
      const estMin = Math.max(1, Math.round(t.estimated_hours * 60));
      const rawRemaining = Math.max(0, estMin - done);
      const remainingMin = Math.max(
        slotMin,
        Math.ceil(rawRemaining / slotMin) * slotMin
      );
      return {
        task: t,
        score: computePriority(t, done, today),
        remainingMin,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    await supabase.from("study_plans").delete().eq("user_id", userId);

    const rows: {
      user_id: string;
      task_id: string;
      planned_date: string;
      duration_minutes: number;
      priority_score: number;
    }[] = [];

    const dayUsed = new Map<string, number>();
    for (let d = 0; d < HORIZON_DAYS; d++) {
      dayUsed.set(formatDate(addDays(today, d)), 0);
    }

    for (const item of scored) {
      let remaining = item.remainingMin;
      for (let d = 0; d < HORIZON_DAYS && remaining > 0; d++) {
        const key = formatDate(addDays(today, d));
        let used = dayUsed.get(key) ?? 0;
        while (used < maxMinPerDay && remaining > 0) {
          const available = maxMinPerDay - used;
          if (available < slotMin) break;
          if (remaining < slotMin) break;
          const minutes = slotMin;

          rows.push({
            user_id: userId,
            task_id: item.task.id,
            planned_date: key,
            duration_minutes: minutes,
            priority_score: Math.round(item.score * 100) / 100,
          });
          used += minutes;
          dayUsed.set(key, used);
          remaining -= minutes;
        }
      }
    }

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Rien à insérer", inserted: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { error: insErr } = await supabase.from("study_plans").insert(rows);
    if (insErr) throw insErr;

    return new Response(
      JSON.stringify({ inserted: rows.length, plans: rows }),
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
