import { Link } from "react-router-dom";
import { LEGAL } from "@/lib/legal";

type Props = {
  ageChecked: boolean;
  privacyChecked: boolean;
  onAgeChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
  ageId?: string;
  privacyId?: string;
};

export function GdprChecks({
  ageChecked,
  privacyChecked,
  onAgeChange,
  onPrivacyChange,
  ageId = "gdpr-age",
  privacyId = "gdpr-privacy",
}: Props) {
  return (
    <div className="space-y-3 text-sm leading-relaxed">
      <label htmlFor={ageId} className="flex items-start gap-2">
        <input
          id={ageId}
          type="checkbox"
          checked={ageChecked}
          onChange={(e) => onAgeChange(e.target.checked)}
          className="mt-1"
          required
        />
        <span>Je confirme avoir {LEGAL.minAge} ans ou plus.</span>
      </label>
      <label htmlFor={privacyId} className="flex items-start gap-2">
        <input
          id={privacyId}
          type="checkbox"
          checked={privacyChecked}
          onChange={(e) => onPrivacyChange(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          J’ai lu la{" "}
          <Link
            to="/confidentialite"
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            politique de confidentialité
          </Link>{" "}
          (version du {LEGAL.lastUpdated}).
        </span>
      </label>
    </div>
  );
}
