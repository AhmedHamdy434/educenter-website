import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  className?: string;
  spinnerClassName?: string;
}

export function Loading({ message = "جاري التحميل...", className, spinnerClassName }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-20 text-slate-400 gap-2", className)}>
      <Loader2 className={cn("size-8 animate-spin text-[#1E4632]", spinnerClassName)} />
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
