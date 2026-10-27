import { supabase } from "@/lib/supabase";
export async function fetchSubjects(userId) {
    const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", userId)
        .order("name");
    if (error)
        throw error;
    return data;
}
export async function createSubject(userId, input) {
    const { data, error } = await supabase
        .from("subjects")
        .insert({ user_id: userId, name: input.name, color: input.color })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function updateSubject(id, patch) {
    const { data, error } = await supabase
        .from("subjects")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function deleteSubject(id) {
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (error)
        throw error;
}
export async function fetchTasks(userId) {
    const { data, error } = await supabase
        .from("tasks")
        .select("*, subjects(name, color)")
        .eq("user_id", userId)
        .order("deadline");
    if (error)
        throw error;
    return data;
}
export async function createTask(userId, input) {
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
    if (error)
        throw error;
    return data;
}
export async function updateTask(id, patch) {
    const { data, error } = await supabase
        .from("tasks")
        .update(patch)
        .eq("id", id)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function deleteTask(id) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error)
        throw error;
}
export async function fetchStudySessions(userId) {
    const { data, error } = await supabase
        .from("study_sessions")
        .select("id, task_id, date, duration_minutes, completed, tasks(title, subject_id)")
        .eq("user_id", userId)
        .order("date", { ascending: false });
    if (error)
        throw error;
    return data;
}
export async function insertStudySession(input) {
    const { data, error } = await supabase
        .from("study_sessions")
        .insert(input)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
export async function fetchStudyPlans(userId) {
    const { data, error } = await supabase
        .from("study_plans")
        .select("id, planned_date, duration_minutes, priority_score, task_id, tasks(title, subject_id)")
        .eq("user_id", userId)
        .order("planned_date");
    if (error)
        throw error;
    return data;
}
export async function invokeGenerateStudyPlan(userId, settings) {
    const { data: { session }, } = await supabase.auth.getSession();
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
    let payload = null;
    try {
        payload = await res.json();
    }
    catch {
        payload = null;
    }
    if (!res.ok) {
        const details = payload && typeof payload === "object" && "error" in payload
            ? String(payload.error ?? "")
            : payload && typeof payload === "object" && "message" in payload
                ? String(payload.message ?? "")
                : "";
        throw new Error(details ? `HTTP ${res.status} - ${details}` : `HTTP ${res.status} - Erreur Edge Function`);
    }
    return (payload ?? {});
}
export async function invokeSendAlertsEmail(userId) {
    const { data: { session }, } = await supabase.auth.getSession();
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
    let payload = null;
    try {
        payload = await res.json();
    }
    catch {
        payload = null;
    }
    if (!res.ok) {
        const details = payload && typeof payload === "object" && "error" in payload
            ? String(payload.error ?? "")
            : payload && typeof payload === "object" && "message" in payload
                ? String(payload.message ?? "")
                : "";
        throw new Error(details ? `HTTP ${res.status} - ${details}` : `HTTP ${res.status} - Erreur Edge Function`);
    }
    return (payload ?? {});
}
export async function fetchProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
    if (error)
        throw error;
    return data;
}
export async function upsertProfile(input) {
    const { data, error } = await supabase
        .from("profiles")
        .upsert({
        ...input,
        updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" })
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
