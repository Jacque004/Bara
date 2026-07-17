import { Outlet } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTasksRealtime } from "@/hooks/useTasksRealtime";

export function Layout() {
  const { user } = useAuth();
  useTasksRealtime(user?.id);

  return (
    <div className="bara-app-shell flex min-h-dvh flex-col">
      <Sidebar />
      <main className="bara-main-mobile min-w-0 flex-1 overflow-auto px-3 py-4 sm:px-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>
      <MobileBottomNav />
    </div>
  );
}
