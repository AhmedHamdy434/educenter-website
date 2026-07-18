"use client";

import React, { useState, useMemo } from "react";
import { CalendarCheck, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TableSearch } from "@/components/common/TableSearch";
import { Loading } from "@/components/common/Loading";
import { SharedTable } from "@/components/common/SharedTable";
import { useStudentAttendanceReportQuery } from "@/features/attendance/hooks/queries";
import { type StudentAttendanceReport } from "@/features/attendance/types";
import { type ApiResponse } from "@/types";
import { getStudentAttendanceColumns } from "./columns";

interface StudentAttendanceHistoryClientProps {
  initialData: ApiResponse<StudentAttendanceReport>;
  studentId: string;
}

export function StudentAttendanceHistoryClient({
  initialData,
  studentId,
}: StudentAttendanceHistoryClientProps) {
  const [search, setSearch] = useState("");

  // Fetch student report with TanStack Query
  const { data: response, isLoading } = useStudentAttendanceReportQuery(
    studentId,
    true
  );

  const reportData = response?.data || initialData.data;

  // Filter history locally by search query (group name or date)
  const filteredHistory = useMemo(() => {
    const list = reportData?.history || [];
    return list.filter((item) => {
      const formattedDate = new Date(item.date).toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return (
        item.groupName.toLowerCase().includes(search.toLowerCase()) ||
        formattedDate.includes(search)
      );
    });
  }, [reportData, search]);

  const percentageColor = useMemo(() => {
    const rate = reportData?.attendancePercentage || 0;
    if (rate >= 90) return "text-green-600";
    if (rate >= 75) return "text-amber-500";
    return "text-red-600";
  }, [reportData]);

  // Define columns for SharedTable
  const columns = useMemo(() => getStudentAttendanceColumns(), []);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="size-6 text-[#1E4632]" />
            سجل الحضور والغياب
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            مرحباً بك {reportData?.student.fullName || "طالبنا العزيز"}، يمكنك هنا متابعة تفاصيل حضورك وغيابك في الحصص المختلفة.
          </p>
        </div>

        <div className="w-full md:w-80">
          <TableSearch
            placeholder="ابحث باسم المجموعة أو التاريخ..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {isLoading && !reportData ? (
        <Loading message="جاري تحميل سجل الحضور..." />
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
              <span className="text-xs text-slate-400 font-semibold mb-1">نسبة الحضور</span>
              <span className={`text-3xl font-black ${percentageColor}`}>
                {reportData?.attendancePercentage || 0}%
              </span>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
              <span className="text-xs text-slate-400 font-semibold mb-1">إجمالي الحصص</span>
              <span className="text-3xl font-bold text-slate-800">
                {reportData?.totalSessions || 0} حصة
              </span>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
              <span className="text-xs text-slate-400 font-semibold mb-1">أيام الحضور</span>
              <span className="text-3xl font-bold text-green-600 flex items-center gap-1.5">
                <CheckCircle className="size-5 shrink-0" />
                {reportData?.present || 0}
              </span>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
              <span className="text-xs text-slate-400 font-semibold mb-1">أيام الغياب</span>
              <span className="text-3xl font-bold text-red-600 flex items-center gap-1.5">
                <XCircle className="size-5 shrink-0" />
                {reportData?.absent || 0}
              </span>
            </Card>

            <Card className="p-6 flex flex-col items-center justify-center border border-slate-100 shadow-sm text-center">
              <span className="text-xs text-slate-400 font-semibold mb-1">تأخير / إذن</span>
              <span className="text-3xl font-bold text-slate-700 flex items-center gap-2">
                <span className="text-amber-500 flex items-center gap-1">
                  <Clock className="size-4 shrink-0" />
                  {reportData?.late || 0}
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <AlertCircle className="size-4 shrink-0" />
                  {reportData?.excused || 0}
                </span>
              </span>
            </Card>
          </div>

          {/* Logs Log/History Table */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Calendar className="size-4.5 text-[#1E4632]" />
              سجل الحصص التفصيلي ({filteredHistory.length})
            </h3>

            <SharedTable
              columns={columns}
              data={filteredHistory}
              isLoading={isLoading}
              emptyMessage={
                search
                  ? "لم يتم العثور على أي حصص تطابق بحثك الحالي."
                  : "لا يوجد سجل حضور وغياب مسجل لك في أي مجموعة دراسية بعد."
              }
            />
          </div>
        </>
      )}
    </div>
  );
}
