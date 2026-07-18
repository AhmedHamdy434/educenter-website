"use client";

import { Landmark, Loader2, AlertCircle } from "lucide-react";
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
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Loader2 className="size-8 animate-spin text-[#1E4632] mb-3" />
            <p className="text-xs font-semibold">جاري تحميل سجل المدفوعات...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto border border-slate-100 rounded-xl max-h-96 overflow-y-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold sticky top-0">
                  <th className="p-3">المجموعة الدراسية</th>
                  <th className="p-3">شهر الاشتراك</th>
                  <th className="p-3">المبلغ المدفوع</th>
                  <th className="p-3">تاريخ ووقت التحصيل</th>
                  <th className="p-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{payment.group.name}</td>
                    <td className="p-3 font-medium text-[#1E4632]">{formatMonthName(payment.subscriptionDate)}</td>
                    <td className="p-3 font-bold text-slate-700">{payment.amount.toFixed(2)} ج.م</td>
                    <td className="p-3 font-mono text-slate-400 text-[10px]" dir="ltr">
                      {formatFullDate(payment.paidAt)}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-[120px]" title={payment.notes || ""}>
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 bg-slate-50/50 border border-slate-100 rounded-xl">
            <Landmark className="size-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-500 text-xs">لا يوجد مدفوعات مسجلة</p>
            <p className="text-[11px] text-slate-400 mt-0.5">لم يتم تسجيل أي عمليات تحصيل اشتراك لهذا الطالب بعد.</p>
          </div>
        )}
      </div>
    </SharedModal>
  );
}
