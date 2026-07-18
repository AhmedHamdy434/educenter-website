"use client";

import { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Calendar,
  Landmark,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SharedModal } from "@/components/common/SharedModal";
import { useGroupPaymentsQuery, useGroupQuery } from "../../hooks/queries";
import { usePayGroupStudentMonthMutation } from "../../hooks/mutations";
import { type GroupStudentPaymentInfo } from "../../types";
import { formatMonthName } from "@/utils/time";

interface GroupPaymentsTabProps {
  groupId: string;
}

export function GroupPaymentsTab({ groupId }: GroupPaymentsTabProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<GroupStudentPaymentInfo | null>(null);
  const [notes, setNotes] = useState("");

  // 1. Fetch group details to get startDate and monthsCount
  const { data: groupRes } = useGroupQuery(groupId);
  const group = groupRes?.data;

  // 2. Fetch payments list
  const { data: paymentsRes, isLoading: isPaymentsLoading } =
    useGroupPaymentsQuery(groupId);
  const payments = useMemo(
    () => paymentsRes?.data || [],
    [paymentsRes?.data]
  );

  // 3. Mutation for recording payment
  const { mutateAsync: recordPayment, isPending: isRecordPending } =
    usePayGroupStudentMonthMutation();

  const startDate = group?.startDate;
  const monthsCount = group?.monthsCount;

  // Generate available months based on group schedule duration
  const availableMonths = useMemo(() => {
    if (!startDate || !monthsCount) return [];
    const months: string[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < monthsCount; i++) {
      const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      months.push(`${yyyy}-${mm}-01`);
    }
    return months;
  }, [startDate, monthsCount]);

  const defaultMonth = useMemo(() => {
    if (availableMonths.length === 0) return "";
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
    return availableMonths.includes(todayStr) ? todayStr : availableMonths[0];
  }, [availableMonths]);

  const activeMonth = selectedMonth || defaultMonth;

  // Filter students based on search query
  const filteredPayments = useMemo(() => {
    return payments.filter(
      (item) =>
        item.studentInfo.fullName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.studentInfo.phone.includes(searchQuery),
    );
  }, [payments, searchQuery]);

  // Calculate statistics for the active month
  const stats = useMemo(() => {
    if (!activeMonth || payments.length === 0) {
      return {
        total: payments.length,
        paid: 0,
        unpaid: 0,
        expected: 0,
        collected: 0,
      };
    }

    let paidCount = 0;
    let unpaidCount = 0;
    let expectedRevenue = 0;
    let collectedRevenue = 0;

    payments.forEach((student) => {
      // Is this month required for this student?
      const isRequired = student.requiredMonths.includes(activeMonth);
      if (isRequired) {
        expectedRevenue += student.monthlyFee;

        // Has student paid for this month?
        const paymentRecord = student.paidMonths.find(
          (p) => p.subscriptionDate === activeMonth,
        );

        if (paymentRecord) {
          paidCount++;
          collectedRevenue += paymentRecord.amount;
        } else {
          unpaidCount++;
        }
      }
    });

    return {
      total: payments.length,
      paid: paidCount,
      unpaid: unpaidCount,
      expected: expectedRevenue,
      collected: collectedRevenue,
    };
  }, [activeMonth, payments]);

  const handleOpenRecordModal = (student: GroupStudentPaymentInfo) => {
    setSelectedStudent(student);
    setNotes("");
  };

  const handleCloseRecordModal = () => {
    setSelectedStudent(null);
    setNotes("");
  };

  const handleRecordPayment = async () => {
    if (!selectedStudent || !activeMonth) return;
    await recordPayment(
      {
        groupStudentId: selectedStudent.groupStudentId,
        subscriptionDate: activeMonth,
        notes: notes || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            handleCloseRecordModal();
          }
        },
      },
    );
  };

  if (isPaymentsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="size-10 animate-spin text-[#1E4632] mb-3" />
        <p className="text-sm font-semibold">جاري تحميل بيانات الاشتراكات...</p>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <Card className="p-12 text-center text-slate-400 bg-slate-50/50 border border-slate-100 rounded-2xl">
        <CreditCard className="size-12 mx-auto text-slate-300 mb-3" />
        <p className="font-semibold text-slate-500">
          لا يوجد طلاب مسجلون بالمجموعة
        </p>
        <p className="text-xs text-slate-400 mt-1">
          قم بإدراج طلاب أولاً لتتمكن من إدارة الاشتراكات والمدفوعات الخاصة بهم.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Month Selector & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Calendar className="size-5 text-[#1E4632] shrink-0" />
          <label className="text-sm font-bold text-slate-700 shrink-0">
            الشهر المستهدف:
          </label>
          <select
            value={activeMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#1E4632] transition-colors w-full sm:w-48 cursor-pointer"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthName(m)}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="ابحث عن طالب بالاسم..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 pr-10 pl-3 rounded-xl border border-slate-200 text-sm text-right"
          />
        </div>
      </div>

      {/* 2. Summary Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow bg-white rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">
            إجمالي الطلاب
          </span>
          <span className="text-2xl font-black text-slate-800 mt-2">
            {stats.total}
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow bg-white rounded-xl">
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-md font-semibold self-start">
            المسددون
          </span>
          <span className="text-2xl font-black text-green-700 mt-2">
            {stats.paid}
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow bg-white rounded-xl">
          <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-md font-semibold self-start">
            المتبقون
          </span>
          <span className="text-2xl font-black text-red-700 mt-2">
            {stats.unpaid}
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow bg-white rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">
            الإيراد المتوقع
          </span>
          <span className="text-lg font-black text-slate-700 mt-2">
            {stats.expected.toFixed(2)} ج.م
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between border border-slate-100 hover:shadow-md transition-shadow bg-white rounded-xl">
          <span className="text-xs text-slate-400 font-semibold">
            الإيراد المحصل
          </span>
          <span className="text-lg font-black text-[#1E4632] mt-2">
            {stats.collected.toFixed(2)} ج.م
          </span>
        </Card>
      </div>

      {/* 3. Students Payments Table */}
      <Card className="p-0 overflow-hidden border border-slate-100 bg-white rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                <th className="p-4">اسم الطالب</th>
                <th className="p-4">رقم الهاتف</th>
                <th className="p-4">بداية الاشتراك</th>
                <th className="p-4">الاشتراك الشهري</th>
                <th className="p-4 text-center">حالة الدفع</th>
                <th className="p-4 text-center">الملاحظات</th>
                <th className="p-4 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {filteredPayments.map((item) => {
                const isRequired = item.requiredMonths.includes(activeMonth);
                const paymentRecord = item.paidMonths.find(
                  (p) => p.subscriptionDate === activeMonth,
                );
                const isPaid = !!paymentRecord;

                return (
                  <tr
                    key={item.groupStudentId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex flex-col">
                        <span>{item.studentInfo.fullName}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          {item.studentInfo.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {item.studentInfo.phone}
                    </td>
                    <td className="p-4 text-slate-400 text-xs">
                      {item.subscriptionStartDate
                        ? new Date(
                            item.subscriptionStartDate,
                          ).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>
                    <td className="p-4 font-bold text-slate-700">
                      {item.monthlyFee.toFixed(2)} ج.م
                    </td>
                    <td className="p-4 text-center">
                      {!isRequired ? (
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-400 border border-slate-200/50">
                          غير مستحق
                        </span>
                      ) : isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/50">
                          <CheckCircle className="size-3" />
                          تم التحصيل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/50">
                          <AlertCircle className="size-3" />
                          غير مدفوع
                        </span>
                      )}
                    </td>
                    <td
                      className="p-4 text-center text-xs text-slate-400 max-w-[150px] truncate"
                      title={paymentRecord?.notes || ""}
                    >
                      {paymentRecord?.notes || "—"}
                    </td>
                    <td className="p-4 text-center">
                      {isRequired && !isPaid && (
                        <Button
                          onClick={() => handleOpenRecordModal(item)}
                          variant="brand"
                          size="sm"
                          className="h-8 px-3 rounded-lg text-xs flex items-center gap-1 mx-auto"
                        >
                          <Landmark className="size-3.5" />
                          تسجيل الدفع
                        </Button>
                      )}
                      {(!isRequired || isPaid) && (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Record Payment Modal Dialog */}
      {selectedStudent && (
        <SharedModal
          isOpen={!!selectedStudent}
          onClose={handleCloseRecordModal}
          title="تحصيل اشتراك الطالب"
        >
          <div className="space-y-4 text-right" dir="rtl">
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">الطالب:</span>
                <span className="font-bold text-slate-800">
                  {selectedStudent.studentInfo.fullName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">الشهر:</span>
                <span className="font-bold text-slate-800">
                  {formatMonthName(activeMonth)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-slate-200/50 pt-2">
                <span className="text-slate-400">مبلغ الاشتراك:</span>
                <span className="font-bold text-[#1E4632]">
                  {selectedStudent.monthlyFee.toFixed(2)} ج.م
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="paymentNotes"
                className="text-xs font-bold text-slate-700"
              >
                ملاحظات الدفع (اختياري)
              </label>
              <textarea
                id="paymentNotes"
                rows={3}
                placeholder="مثال: دفع نقداً كاش / تحويل محفظة إلكترونية..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#1E4632] focus:ring-1 focus:ring-[#1E4632] outline-none text-sm transition-all text-right resize-none animate-none"
              />
            </div>

            <div className="flex gap-3 justify-end border-t border-slate-100 pt-4 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseRecordModal}
                className="h-10 px-5 rounded-xl text-slate-600"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="brand"
                onClick={handleRecordPayment}
                disabled={isRecordPending}
                className="h-10 px-6 rounded-xl flex items-center gap-2"
              >
                {isRecordPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    جاري التسجيل...
                  </>
                ) : (
                  <>
                    <CheckCircle className="size-4" />
                    تأكيد وتسجيل الدفع
                  </>
                )}
              </Button>
            </div>
          </div>
        </SharedModal>
      )}
    </div>
  );
}
