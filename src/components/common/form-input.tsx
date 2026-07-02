import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface FormInputProps extends React.ComponentProps<typeof Input> {
  label?: string;
  error?: string;
}

export function FormInput({
  className,
  label,
  error,
  id,
  ...props
}: FormInputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <Label htmlFor={id} className="text-xs font-semibold text-slate-600 block">
          {label}
        </Label>
      )}
      <Input
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full h-11 px-4 py-3 rounded-xl border bg-transparent text-slate-800 text-sm font-medium outline-none transition-all",
          error
            ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/5"
            : "border-slate-200 focus-visible:border-[#1e4632] focus-visible:ring-[#1e4632]/5",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
