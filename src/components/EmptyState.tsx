import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
};

/** État vide invitant à l’action (rétention). */
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: Props) {
  return (
    <div className="bara-empty flex flex-col items-center px-4 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/12 text-orange-600 dark:text-orange-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-bara-muted)]">
        {description}
      </p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-flex rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 active:scale-[0.98]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
