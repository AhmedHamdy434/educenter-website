"use client";

import React, { useState } from "react";
import { CalendarCheck, Calendar, Play, Loader2, Users, Edit3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/common/Loading";
import {
  useGroupAttendanceSessionsQuery,
} from "@/features/attendance/hooks/queries";
import {
  useStartAttendanceSessionMutation,
} from "@/features/attendance/hooks/mutations";
import { AttendanceRecorder } from "./AttendanceRecorder";

interface AttendanceTabProps {
  groupId: string;
  totalStudents: number;
}

export function AttendanceTab({ groupId, totalStudents }: AttendanceTabProps) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // 1. Fetch sessions list
  const { data: response, isLoading } = useGroupAttendanceSessionsQuery(groupId);
  const startSessionMutation = useStartAttendanceSessionMutation();

  const sessions = response?.data || [];

  // Handler to start/reopen today's session
  const handleStartTodaySession = async () => {
    await startSessionMutation.mutateAsync(groupId, {
      onSuccess: (res) => {
        if (res.success && res.data) {
          setActiveSessionId(res.data.id);
        }
      },
    });
  };

  // If a session is open, render the recorder
  if (activeSessionId) {
    return (
      <AttendanceRecorder
        groupId={groupId}
        sessionId={activeSessionId}
        onBack={() => setActiveSessionId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Top Banner / Call to Action */}
      <Card className="p-6 bg-linear-to-l from-emerald-50/50 to-teal-50/30 border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex gap-4 items-start">
          <div className="size-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CalendarCheck className="size-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-800">حضور وغياب حصة اليوم</h2>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              يمكنك بدء وتوثيق حضور الطلاب لحصة اليوم الحالي. يقوم النظام تلقائياً بإنشاء جلسة تحضير حضور لليوم، أو فتح الجلسة الحالية إذا كانت منشأة مسبقاً.
            </p>
          </div>
        </div>

        <Button
          onClick={handleStartTodaySession}
          disabled={startSessionMutation.isPending}
          variant="brand"
          className="h-10 px-6 rounded-xl flex items-center gap-2 font-semibold shadow-md whitespace-nowrap self-start md:self-auto cursor-pointer"
        >
          {startSessionMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              جاري فتح الحصة...
            </>
          ) : (
            <>
              <Play className="size-4 fill-white" />
              بدء تحضير حصة اليوم
            </>
          )}
        </Button>
      </Card>

      {/* History log title */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="size-4.5 text-[#1E4632]" />
          سجل الحصص السابقة ({sessions.length})
        </h3>

        {/* Sessions table list */}
        {isLoading ? (
          <Loading message="جاري تحميل سجل التحضير..." className="py-12 bg-white rounded-2xl border border-slate-100 shadow-sm" />
        ) : sessions.length > 0 ? (
          <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white shadow-sm">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="p-4">تاريخ الحصة</th>
                  <th className="p-4">حضور الطلاب</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {sessions.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">
                      {new Date(session.date).toLocaleDateString("ar-EG", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5" />
                        {session._count?.records || 0} / {totalStudents} طالب
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Button
                        onClick={() => setActiveSessionId(session.id)}
                        variant="ghost"
                        size="icon"
                        title="تعديل حضور الحصة"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg"
                      >
                        <Edit3 className="size-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/10">
            <CalendarCheck className="size-12 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">سجل حضور الحصص فارغ</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              لم تقم بتسجيل حضور أي حصة لهذه المجموعة حتى الآن. اضغط على الزر أعلاه لتسجيل حضور حصة اليوم.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
