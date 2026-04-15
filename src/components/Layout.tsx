import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTasksRealtime } from "@/hooks/useTasksRealtime";

export function Layout() {
  const { user } = useAuth();
  useTasksRealtime(user?.id);

  return (
    <div className="flex min-h-dvh flex-col">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
