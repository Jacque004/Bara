/** Helpers d’accueil et d’engagement (dashboard / focus). */

export function greetingForHour(hour = new Date().getHours()): string {
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

/** Objectif quotidien souple (minutes) pour le feedback de progression. */
export const DAILY_STUDY_GOAL_MIN = 60;

export function computeStudyStreak(
  sessionDates: string[],
  todayISO = new Date().toISOString().slice(0, 10)
): number {
  const days = new Set(sessionDates.map((d) => d.slice(0, 10)));
  let streak = 0;
  const cursor = new Date(`${todayISO}T12:00:00`);
  // Si pas d’étude aujourd’hui, on compte depuis hier (streak encore vivant).
  if (!days.has(todayISO)) {
    cursor.setDate(cursor.getDate() - 1);
  }
  for (;;) {
    const key = cursor.toISOString().slice(0, 10);
    if (!days.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function minutesToday(
  sessions: { date: string; duration_minutes: number }[],
  todayISO = new Date().toISOString().slice(0, 10)
): number {
  return sessions
    .filter((s) => s.date.slice(0, 10) === todayISO)
    .reduce((acc, s) => acc + s.duration_minutes, 0);
}
