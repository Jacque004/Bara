import { LEGAL } from "@/lib/legal";

export const GDPR_PENDING_KEY = "bara-gdpr-accept";
export const PLANNING_SETTINGS_KEY = "bara-planning-settings";
export const RECOVERY_FLAG = "bara-password-recovery";

export function onboardingStorageKey(userId: string) {
  return `bara-onboarding-closed:${userId}`;
}

type GdprMeta = {
  age_confirmed_at?: unknown;
  privacy_policy_version?: unknown;
  processing_restricted_at?: unknown;
} | null | undefined;

export function hasGdprAcceptance(meta: GdprMeta): boolean {
  return (
    typeof meta?.age_confirmed_at === "string" &&
    meta.age_confirmed_at.length > 0 &&
    meta.privacy_policy_version === LEGAL.policyVersion
  );
}

export function isProcessingRestricted(meta: GdprMeta): boolean {
  return (
    typeof meta?.processing_restricted_at === "string" &&
    meta.processing_restricted_at.length > 0
  );
}

export function gdprAcceptancePayload(at = new Date().toISOString()) {
  return {
    age_confirmed_at: at,
    privacy_accepted_at: at,
    privacy_policy_version: LEGAL.policyVersion,
  };
}

export function clearAccountLocalData(userId: string) {
  try {
    localStorage.removeItem(onboardingStorageKey(userId));
    localStorage.removeItem(PLANNING_SETTINGS_KEY);
    sessionStorage.removeItem(GDPR_PENDING_KEY);
    sessionStorage.removeItem(RECOVERY_FLAG);
  } catch {
    /* stockage du navigateur indisponible */
  }
}

export function readPlanningSettings(): unknown {
  try {
    const raw = localStorage.getItem(PLANNING_SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
