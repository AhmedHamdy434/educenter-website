"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "تأكيد الحذف",
  description = "هل أنت متأكد من رغبتك في حذف هذا العنصر؟ لا يمكن التراجع عن هذا الإجراء.",
  confirmText = "حذف",
  cancelText = "إلغاء",
  isLoading = false,
  isDestructive = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm transition-opacity" dir="rtl">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Dialog Card */}
      <div className="relative w-full max-w-md rounded-2xl p-6 bg-white shadow-2xl transition-all border border-slate-100 animate-in zoom-in-95 duration-200 z-10 flex flex-col gap-4 text-right">
        <div className="flex gap-4">
          <div className={`size-12 rounded-full flex items-center justify-center shrink-0 ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 px-5 rounded-xl text-slate-600"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "brand"}
            onClick={async () => {
              await onConfirm();
            }}
            disabled={isLoading}
            className="h-10 px-6 rounded-xl flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري المعالجة...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
