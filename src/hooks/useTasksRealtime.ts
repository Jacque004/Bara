import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * Synchronise les tâches via Supabase Realtime : invalide le cache React Query
 * sur INSERT / UPDATE / DELETE pour l’utilisateur connecté.
 */
export function useTasksRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`tasks-user-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tasks",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("BARA Realtime (tasks): erreur de canal");
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}
