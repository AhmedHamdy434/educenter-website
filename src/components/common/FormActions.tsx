"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  submitLabel: string;
  cancelLabel?: string;
  disabled?: boolean;
}

export function FormActions({
  onCancel,
  isSubmitting,
  submitLabel="حفظ",
  cancelLabel = "إلغاء",
  disabled = false,
}: FormActionsProps) {
  return (
    <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
      <Button
        type="button"
        variant="brandOutline"
        onClick={onCancel}
        disabled={isSubmitting || disabled}
        className="h-11 px-6 rounded-lg text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        variant="brand"
        disabled={isSubmitting || disabled}
        className="h-11 px-6 rounded-lg bg-[#1E4632] hover:bg-[#163625] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="ml-2 size-4 animate-spin" />
            جاري الحفظ...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
