"use client";

import React, { useState } from "react";
import { Loader2, Save, ArrowRight, UserCheck, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/common/Loading";
import { useAttendanceSessionDetailsQuery } from "@/features/attendance/hooks/queries";
import { useSaveAttendanceMutation } from "@/features/attendance/hooks/mutations";
import { AttendanceStatus } from "@/features/attendance/types";

interface AttendanceRecorderProps {
  groupId: string;
  sessionId: string;
  onBack: () => void;
}

export function AttendanceRecorder({ groupId, sessionId, onBack }: AttendanceRecorderProps) {
  // 1. Fetch Session details (includes student list and their status)
  const { data: response, isLoading } = useAttendanceSessionDetailsQuery(groupId, sessionId);
  const saveMutation = useSaveAttendanceMutation();

  // Local state to track modified attendance records on-demand
  const [records, setRecords] = useState<Record<string, { status: AttendanceStatus; reason: string }>>({});

  const studentList = response?.data?.students || [];
  const sessionData = response?.data?.session;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) => {
      const student = studentList.find((s) => s.studentId === studentId);
      const currentReason = prev[studentId]?.reason ?? student?.absenceReason ?? "";
      return {
        ...prev,
        [studentId]: {
          status,
          reason: status === AttendanceStatus.ABSENT ? currentReason : "",
        },
      };
    });
  };

  const handleReasonChange = (studentId: string, reason: string) => {
    setRecords((prev) => {
      const student = studentList.find((s) => s.studentId === studentId);
      const currentStatus = prev[studentId]?.status ?? student?.status ?? AttendanceStatus.ABSENT;
      return {
        ...prev,
        [studentId]: {
          status: currentStatus,
          reason,
        },
      };
    });
  };

  const handleSave = async () => {
    const payloadRecords = studentList.map((s) => {
      const record = records[s.studentId];
      const status = record ? record.status : (s.status || AttendanceStatus.PRESENT);
      const reason = record ? record.reason : (s.absenceReason || "");
      return {
        studentId: s.studentId,
        status,
        absenceReason: status === AttendanceStatus.ABSENT ? reason : undefined,
      };
    });

    await saveMutation.mutateAsync({
      groupId,
      sessionId,
      data: { records: payloadRecords },
    });
  };

  if (isLoading) {
    return <Loading message="جاري تحميل قائمة الطلاب..." />;
  }

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">تسجيل حضور حصة اليوم</h2>
          <p className="text-xs text-slate-400">
            التاريخ: {sessionData ? new Date(sessionData.date).toLocaleDateString("ar-EG", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) : ""}
          </p>
        </div>

        <Button
          onClick={onBack}
          variant="outline"
          className="h-9 px-4 rounded-xl flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowRight className="size-4" />
          <span>رجوع للسجل</span>
        </Button>
      </div>

      {/* Student List cards */}
      {studentList.length > 0 ? (
        <div className="space-y-4">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 text-xs font-bold text-slate-400 border-b border-slate-100 pb-2">
            <span className="col-span-4">اسم الطالب</span>
            <span className="col-span-5 text-center">حالة الحضور والغياب</span>
            <span className="col-span-3">ملاحظات / سبب الغياب</span>
          </div>

          <div className="space-y-3">
            {studentList.map((student) => {
              const currentRecord = records[student.studentId];
              const currentStatus = currentRecord ? currentRecord.status : (student.status || AttendanceStatus.PRESENT);
              const currentReason = currentRecord ? currentRecord.reason : (student.absenceReason || "");
              const isAbsent = currentStatus === AttendanceStatus.ABSENT;

              return (
                <Card
                  key={student.studentId}
                  className="p-4 lg:py-3.5 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center border border-slate-100 hover:border-slate-200 transition-colors shadow-sm"
                >
                  {/* Name and Info */}
                  <div className="col-span-1 lg:col-span-4 flex items-center gap-3">
                    <div className="size-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {student.fullName.substring(0, 2)}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-slate-800 text-sm truncate">{student.fullName}</span>
                      <span className="text-[10px] text-slate-400">{student.phone}</span>
                    </div>
                  </div>

                  {/* Segmented Status Selector */}
                  <div className="col-span-1 lg:col-span-5 flex justify-center">
                    <div className="grid grid-cols-4 gap-1 bg-slate-100/80 p-1 rounded-xl w-full max-w-md">
                      {/* PRESENT */}
                      <button
                        onClick={() => handleStatusChange(student.studentId, AttendanceStatus.PRESENT)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === AttendanceStatus.PRESENT
                            ? "bg-green-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                      >
                        <UserCheck className="size-3.5" />
                        <span>حاضر</span>
                      </button>

                      {/* LATE */}
                      <button
                        onClick={() => handleStatusChange(student.studentId, AttendanceStatus.LATE)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === AttendanceStatus.LATE
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                      >
                        <Clock className="size-3.5" />
                        <span>متأخر</span>
                      </button>

                      {/* ABSENT */}
                      <button
                        onClick={() => handleStatusChange(student.studentId, AttendanceStatus.ABSENT)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === AttendanceStatus.ABSENT
                            ? "bg-red-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                      >
                        <XCircle className="size-3.5" />
                        <span>غائب</span>
                      </button>

                      {/* EXCUSED */}
                      <button
                        onClick={() => handleStatusChange(student.studentId, AttendanceStatus.EXCUSED)}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                          currentStatus === AttendanceStatus.EXCUSED
                            ? "bg-slate-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200/50"
                        }`}
                      >
                        <AlertCircle className="size-3.5" />
                        <span>مستأذن</span>
                      </button>
                    </div>
                  </div>

                  {/* Absence Reason */}
                  <div className="col-span-1 lg:col-span-3">
                    {isAbsent ? (
                      <Input
                        placeholder="اكتب سبب الغياب..."
                        value={currentReason}
                        onChange={(e) => handleReasonChange(student.studentId, e.target.value)}
                        className="h-8 rounded-lg text-xs border-red-200 focus:border-red-500 focus:ring-red-500 bg-red-50/10 placeholder:text-slate-300"
                      />
                    ) : (
                      <span className="text-[11px] text-slate-300 italic block pr-2">لا يوجد ملاحظات</span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              variant="brand"
              className="h-10 px-8 rounded-xl flex items-center gap-2 font-semibold shadow-md cursor-pointer"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  جاري حفظ الكشف...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  حفظ كشف حضور الطلاب
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="font-semibold">لا يوجد طلاب مسجلون في هذه المجموعة الدراسية بعد.</p>
        </div>
      )}
    </div>
  );
}
