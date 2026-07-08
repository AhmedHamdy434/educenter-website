import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface FormTextareaProps extends React.ComponentProps<
  typeof Textarea
> {
  label?: string;
  error?: string;
}

export function FormTextarea({
  className,
  label,
  error,
  id,
  ...props
}: FormTextareaProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label
          htmlFor={id}
          className="text-xs font-semibold text-slate-600 block"
        >
          {label}
        </Label>
      )}
      <Textarea
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full px-4 py-3 min-h-40 rounded-xl border bg-transparent text-slate-800 text-sm font-medium outline-none transition-all",
          error
            ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/5"
            : "border-slate-200 focus-visible:border-[#1e4632] focus-visible:ring-[#1e4632]/5",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
