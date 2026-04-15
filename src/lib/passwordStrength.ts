export type PasswordStrength = {
  label: "" | "Faible" | "Moyen" | "Fort";
  width: "0%" | "33%" | "66%" | "100%";
  color: "bg-transparent" | "bg-red-500" | "bg-amber-500" | "bg-green-500";
};

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (password.length === 0) {
    return { label: "", width: "0%", color: "bg-transparent" };
  }
  if (score <= 2) {
    return { label: "Faible", width: "33%", color: "bg-red-500" };
  }
  if (score <= 4) {
    return { label: "Moyen", width: "66%", color: "bg-amber-500" };
  }
  return { label: "Fort", width: "100%", color: "bg-green-500" };
}
