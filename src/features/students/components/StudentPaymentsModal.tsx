"use client";

import { Landmark, Loader2 } from "lucide-react";
import { SharedModal } from "@/components/common/SharedModal";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { formatFullDate, formatMonthName } from "@/utils/time";

interface StudentPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentName: string;
}

export function StudentPaymentsModal({
  isOpen,
  onClose,
  studentId,
  studentName,
}: StudentPaymentsModalProps) {
  const { data: paymentsRes, isLoading } = useStudentPaymentsQuery(studentId, isOpen);
  const payments = paymentsRes?.data || [];

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={onClose}
      title={`سجل مدفوعات الطالب: ${studentName}`}
    >
      <div className="space-y-4 text-right" dir="rtl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary mb-3" />
            <p className="text-xs font-semibold">جاري تحميل سجل المدفوعات...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto border border-border rounded-xl max-h-96 overflow-y-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-secondary/60 border-b border-border text-foreground font-bold sticky top-0">
                  <th className="p-3">المجموعة الدراسية</th>
                  <th className="p-3">شهر الاشتراك</th>
                  <th className="p-3">المبلغ المدفوع</th>
                  <th className="p-3">تاريخ ووقت التحصيل</th>
                  <th className="p-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">{payment.group.name}</td>
                    <td className="p-3 font-bold text-primary">{formatMonthName(payment.subscriptionDate)}</td>
                    <td className="p-3 font-extrabold text-foreground">{payment.amount.toFixed(2)} ج.م</td>
                    <td className="p-3 font-mono text-muted-foreground text-[10px]" dir="ltr">
                      {formatFullDate(payment.paidAt)}
                    </td>
                    <td className="p-3 text-muted-foreground truncate max-w-30" title={payment.notes || ""}>
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-muted-foreground bg-secondary/20 border border-border rounded-xl">
            <Landmark className="size-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="font-bold text-foreground text-xs">لا يوجد مدفوعات مسجلة</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب بعد.</p>
          </div>
        )}
      </div>
    </SharedModal>
  );
}
