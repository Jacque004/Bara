import { readPlanningSettings } from "@/lib/gdpr";
import { LEGAL } from "@/lib/legal";
import { supabase } from "@/lib/supabase";
import type { Profile, Subject, Task, TaskStatus, TaskType } from "@/types/database";

export async function fetchSubjects(userId: string) {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data as Subject[];
}

export async function createSubject(
  userId: string,
  input: { name: string; color: string }
) {
  const { data, error } = await supabase
    .from("subjects")
    .insert({ user_id: userId, name: input.name, color: input.color })
    .select()
    .single();
  if (error) throw error;
  return data as Subject;
}

export async function updateSubject(
  id: string,
  patch: Partial<{ name: string; color: string }>
) {
  const { data, error } = await supabase
    .from("subjects")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Subject;
}

export async function deleteSubject(id: string) {
  const { error } = await supabase.from("subjects").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchTasks(userId: string) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*, subjects(name, color)")
    .eq("user_id", userId)
    .order("deadline");
  if (error) throw error;
  return data as (Task & {
    subjects: { name: string; color: string } | null;
  })[];
}

export async function createTask(
  userId: string,
  input: {
    subject_id: string;
    title: string;
    type: TaskType;
    deadline: string;
    estimated_hours: number;
    difficulty: number;
    status?: TaskStatus;
  }
) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      subject_id: input.subject_id,
      title: input.title,
      type: input.type,
      deadline: input.deadline,
      estimated_hours: input.estimated_hours,
      difficulty: input.difficulty,
      status: input.status ?? "todo",
    })
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function updateTask(
  id: string,
  patch: Partial<{
    title: string;
    type: TaskType;
    deadline: string;
    estimated_hours: number;
    difficulty: number;
    status: TaskStatus;
    subject_id: string;
  }>
) {
  const { data, error } = await supabase
    .from("tasks")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Task;
}

export async function deleteTask(id: string) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function fetchStudySessions(userId: string) {
  const { data, error } = await supabase
    .from("study_sessions")
    .select("id, task_id, date, duration_minutes, completed, tasks(title, subject_id)")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertStudySession(input: {
  user_id: string;
  task_id: string;
  date: string;
  duration_minutes: number;
  completed: boolean;
}) {
  const { data, error } = await supabase
    .from("study_sessions")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchStudyPlans(userId: string) {
  const { data, error } = await supabase
    .from("study_plans")
    .select(
      "id, planned_date, duration_minutes, priority_score, task_id, tasks(title, subject_id)"
    )
    .eq("user_id", userId)
    .order("planned_date");
  if (error) throw error;
  return data;
}

export type PlanningSettingsInput = {
  session_minutes?: number;
  daily_minutes_limit?: number;
  start_date?: string;
};

export async function invokeGenerateStudyPlan(
  userId: string,
  settings?: PlanningSettingsInput
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-study-plan`;
  const res = await fetch(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: userId,
      ...(settings ?? {}),
    }),
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const details =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : payload && typeof payload === "object" && "message" in payload
          ? String((payload as { message?: unknown }).message ?? "")
          : "";
    throw new Error(
      details ? `HTTP ${res.status} - ${details}` : `HTTP ${res.status} - Erreur Edge Function`
    );
  }

  return (payload ?? {}) as { inserted?: number; error?: string; message?: string };
}

export async function invokeSendAlertsEmail(userId: string) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-alerts-email`;
  const res = await fetch(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const details =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : payload && typeof payload === "object" && "message" in payload
          ? String((payload as { message?: unknown }).message ?? "")
          : "";
    throw new Error(
      details ? `HTTP ${res.status} - ${details}` : `HTTP ${res.status} - Erreur Edge Function`
    );
  }

  return (payload ?? {}) as { success?: boolean; message?: string };
}

export type AccountExportMeta = {
  email: string | null;
  created_at: string | null;
  age_confirmed_at: string | null;
  privacy_accepted_at: string | null;
  privacy_policy_version: string | null;
};

export async function exportAccountData(userId: string, account: AccountExportMeta) {
  const [profile, subjects, tasks, sessions, plans] = await Promise.all([
    fetchProfile(userId),
    fetchSubjects(userId),
    fetchTasks(userId),
    fetchStudySessions(userId),
    fetchStudyPlans(userId),
  ]);
  return {
    format: "bara-export-v1",
    exported_at: new Date().toISOString(),
    account: { id: userId, ...account },
    profile,
    subjects,
    tasks,
    study_sessions: sessions,
    study_plans: plans,
    local_preferences: {
      planning: readPlanningSettings(),
    },
  };
}

export function downloadAccountExport(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `bara-donnees-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function invokeDeleteAccount() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`;
  const res = await fetch(functionUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: "{}",
  });

  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (res.status === 404) {
    throw new Error(
      `La suppression automatique est indisponible. Écrivez à ${LEGAL.contactEmail} pour faire effacer votre compte.`
    );
  }

  if (!res.ok) {
    const details =
      payload && typeof payload === "object" && "error" in payload
        ? String((payload as { error?: unknown }).error ?? "")
        : "";
    throw new Error(details || `HTTP ${res.status} - Suppression impossible`);
  }
}

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data as Profile | null;
}

export async function upsertProfile(input: {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}) {
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        ...input,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();
  if (error) throw error;
  return data as Profile;
}
