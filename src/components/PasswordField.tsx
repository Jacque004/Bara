import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
};

export function PasswordField({ label, id, className, ...props }: Props) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          {...props}
          id={inputId}
          type={visible ? "text" : "password"}
          className={["bara-field w-full pr-12", className ?? ""].join(" ")}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="bara-touch absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-bara-muted)]"
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          aria-pressed={visible}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
