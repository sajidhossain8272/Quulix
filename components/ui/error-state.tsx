import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Unable to load this section",
  description = "Please try again. The mock API did not return a response in time.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-[28px] border border-red-200/70 bg-red-50/80 p-6 text-left shadow-[0_18px_50px_rgba(185,28,28,0.05)]">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-stone-950">{title}</h3>
        <p className="text-sm leading-6 text-stone-600">{description}</p>
      </div>
      {onRetry ? (
        <Button className="mt-5" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
