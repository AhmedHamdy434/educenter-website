"use client";

import { CreditCard, Landmark, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/ui/card";
import { useStudentPaymentsQuery } from "../hooks/queries";
import { formatFullDate, formatMonthName } from "@/utils/time";

export function StudentPaymentsClient() {
  const { data: paymentsRes, isLoading } = useStudentPaymentsQuery("me");
  const payments = paymentsRes?.data || [];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Page Header */}
      <PageHeader
        title="سجل الاشتراكات والمدفوعات"
        description="استعراض تفاصيل وتاريخ الاشتراكات الشهرية والمدفوعات المسددة للمجموعات المسجل بها."
      />

      {/* Main Card Content */}
      <Card className="p-6 border-slate-100 bg-white">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="size-10 animate-spin text-[#1E4632] mb-3" />
            <p className="text-sm font-semibold">جاري تحميل سجل مدفوعاتك...</p>
          </div>
        ) : payments.length > 0 ? (
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="p-4">المجموعة الدراسية</th>
                  <th className="p-4">شهر الاشتراك</th>
                  <th className="p-4">المبلغ المدفوع</th>
                  <th className="p-4">تاريخ ووقت التحصيل</th>
                  <th className="p-4">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{payment.group.name}</td>
                    <td className="p-4 font-semibold text-[#1E4632]">{formatMonthName(payment.subscriptionDate)}</td>
                    <td className="p-4 font-black text-slate-700">{payment.amount.toFixed(2)} ج.م</td>
                    <td className="p-4 font-mono text-slate-400 text-xs" dir="ltr">
                      {formatFullDate(payment.paidAt)}
                    </td>
                    <td className="p-4 text-slate-400 text-xs" title={payment.notes || ""}>
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <Landmark className="size-12 mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-500">لا يوجد مدفوعات مسجلة بعد</p>
            <p className="text-xs text-slate-400 mt-1">لم نجد أي اشتراكات مسددة مسجلة باسمك في النظام حالياً.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
