"use client";

import React from "react";
import { TrendingUp, Calendar, Users, AlertTriangle, Award, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/common/Loading";
import { useGroupAttendanceReportQuery } from "@/features/attendance/hooks/queries";

interface AttendanceReportsTabProps {
  groupId: string;
}

export function AttendanceReportsTab({ groupId }: AttendanceReportsTabProps) {
  const { data: response, isLoading } = useGroupAttendanceReportQuery(groupId);

  const report = response?.data;

  if (isLoading) {
    return <Loading message="جاري تحميل تقارير الحضور..." />;
  }

  if (!report) {
    return (
      <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <TrendingUp className="size-12 mx-auto text-slate-300 mb-3" />
        <p className="font-semibold">لا تتوفر إحصائيات للمجموعة</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rate Card */}
        <Card className="p-6 flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">نسبة الحضور الإجمالية</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-emerald-600">{report.attendanceRate}%</span>
            </div>
          </div>
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="size-6" />
          </div>
        </Card>

        {/* Sessions Card */}
        <Card className="p-6 flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">إجمالي الحصص المنشأة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800">{report.totalSessions}</span>
              <span className="text-xs text-slate-400 font-semibold">جلسات</span>
            </div>
          </div>
          <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="size-6" />
          </div>
        </Card>

        {/* Students count Card */}
        <Card className="p-6 flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">عدد الطلاب المقيدين</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800">{report.totalStudents}</span>
              <span className="text-xs text-slate-400 font-semibold">طلاب</span>
            </div>
          </div>
          <div className="size-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="size-6" />
          </div>
        </Card>
      </div>

      {/* Lists section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Absence list */}
        <Card className="p-6 space-y-4 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <AlertTriangle className="size-4.5" />
            الطلاب الأكثر غياباً (تنبيه المتابعة)
          </h3>

          {report.highestAbsence.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {report.highestAbsence.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between py-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-slate-700">{item.fullName}</span>
                    <span className="text-[10px] text-slate-400 block">نسبة المشاركة: {Math.round((item.present / (item.totalRecorded || 1)) * 100)}%</span>
                  </div>
                  <div className="bg-red-50 border border-red-100 px-3 py-1 rounded-xl text-xs font-bold text-red-600">
                    {item.absent} غيابات
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">لا يوجد طلاب متغيبين في المجموعة حالياً.</p>
          )}
        </Card>

        {/* Perfect Attendance list */}
        <Card className="p-6 space-y-4 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Award className="size-4.5" />
            طلاب ذوي حضور مثالي (كشف الشرف)
          </h3>

          {report.perfectAttendance.length > 0 ? (
            <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {report.perfectAttendance.map((item) => (
                <div key={item.studentId} className="flex items-center justify-between py-3">
                  <span className="text-sm font-bold text-slate-700">{item.fullName}</span>
                  <div className="bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-xl text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="size-3.5" />
                    <span>كامل ({item.present} حصص)</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-8">لا يتوفر كشف شرف حضور كامل بعد.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
