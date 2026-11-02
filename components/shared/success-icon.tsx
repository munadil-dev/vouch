import { Check } from "lucide-react";

export default function SuccessIcon() {
  return (
    <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
      <Check className="size-5" />
    </span>
  );
}
