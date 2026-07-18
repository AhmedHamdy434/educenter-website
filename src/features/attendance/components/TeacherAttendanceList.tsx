"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useTeacherGroupsQuery } from "@/features/groups/hooks/queries";
import { CalendarCheck, GraduationCap, Users, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/common/TableSearch";
import { Loading } from "@/components/common/Loading";
import { type Group } from "@/features/groups/types";
import { type ApiResponse } from "@/types";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface TeacherAttendanceListProps {
  initialData: ApiResponse<Group[]>;
}

export function TeacherAttendanceList({ initialData }: TeacherAttendanceListProps) {
  const [search, setSearch] = useState("");

  // Load teacher's groups with custom query hook
  const { data: response, isLoading } = useTeacherGroupsQuery(
    { limit: 100 },
    initialData,
  );

  const groupsData = response?.data;

  // Filter only active groups matching search
  const filteredGroups = useMemo(() => {
    const list = groupsData || [];
    return list.filter(
      (g) =>
        g.isActive &&
        (g.name.toLowerCase().includes(search.toLowerCase()) ||
          g.subject.name.toLowerCase().includes(search.toLowerCase()) ||
          g.grade.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [groupsData, search]);

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="size-6 text-[#1E4632]" />
            التحضير والغياب
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            اختر المجموعة الدراسية لتسجيل حضور وغياب الطلاب لحصة اليوم.
          </p>
        </div>

        <div className="w-full md:w-80">
          <TableSearch
            placeholder="ابحث باسم المجموعة أو المادة..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* Grid of Groups */}
      {isLoading ? (
        <Loading message="جاري تحميل المجموعات..." />
      ) : filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card
              key={group.id}
              className="flex flex-col h-full border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 space-y-4"
            >
              {/* Info */}
              <div className="space-y-1 overflow-hidden border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base truncate" title={group.name}>
                  {group.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                  <GraduationCap className="size-3.5" />
                  {group.grade.name}
                </span>
              </div>

              {/* Specs */}
              <div className="space-y-2.5 text-xs text-slate-600 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">المادة الدراسية</span>
                  <span className="font-semibold text-slate-700">{group.subject.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">الطلاب المقيدون</span>
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="size-3.5" />
                    {group._count?.students || 0} طالب
                  </span>
                </div>

                {/* Schedules */}
                <div className="border-t border-slate-50 pt-2.5 space-y-1">
                  <span className="text-slate-400 block mb-1">المواعيد:</span>
                  {group.schedule && group.schedule.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.schedule.map((slot, i) => (
                        <span
                          key={slot.id || i}
                          className="bg-slate-50 border border-slate-100 px-2 py-0.5 rounded text-[10px] font-medium text-slate-500"
                        >
                          {DAY_NAMES_AR[slot.day]}: {formatTime(slot.hour, slot.minute)}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">لا توجد مواعيد محددة</span>
                  )}
                </div>
              </div>

              {/* Redirect Action */}
              <div className="pt-2 border-t border-slate-50">
                <Button
                  asChild
                  variant="brand"
                  className="w-full rounded-xl flex items-center justify-center gap-2 h-9 text-xs"
                >
                  <Link href={`/dashboard/instructor/attendance/${group.id}`}>
                    <span>فتح كشف الحضور والغياب</span>
                    <ArrowLeft className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-3xl bg-white shadow-sm max-w-lg mx-auto">
          <CalendarCheck className="size-16 mx-auto text-slate-200 mb-4" />
          <h3 className="font-bold text-slate-700 text-lg">لا توجد مجموعات نشطة</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {search
              ? "لم يتم العثور على أي مجموعة نشطة تطابق بحثك الحالي."
              : "لا توجد مجموعات نشطة مسؤولة عنها حالياً لتسجيل حضورها."}
          </p>
        </div>
      )}
    </div>
  );
}
