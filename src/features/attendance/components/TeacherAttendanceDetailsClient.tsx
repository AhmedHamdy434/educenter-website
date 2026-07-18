"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CalendarCheck, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGroupQuery } from "@/features/groups/hooks/queries";
import { AttendanceTab } from "@/features/groups/components/group-details/AttendanceTab";
import { type GroupDetails } from "@/features/groups/types";
import { type ApiResponse } from "@/types";

interface TeacherAttendanceDetailsClientProps {
  initialGroupData: ApiResponse<GroupDetails>;
}

export function TeacherAttendanceDetailsClient({
  initialGroupData,
}: TeacherAttendanceDetailsClientProps) {
  // Load group details with TanStack Query
  const { data: groupResponse } = useGroupQuery(
    initialGroupData.data.id,
    true
  );

  const group = groupResponse?.data || initialGroupData.data;

  return (
    <div className="space-y-6 text-right animate-fade-in" dir="rtl">
      {/* Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/dashboard/instructor/attendance" className="hover:text-slate-600 transition-colors">
              التحضير والغياب
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">كشف حضور المجموعة</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="size-6 text-[#1E4632]" />
            كشف حضور وغياب: {group.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1">
              <GraduationCap className="size-3.5" />
              {group.grade.name}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {group.students.length} طالب مسجل
            </span>
            <span className="text-slate-300">•</span>
            <span>المادة: {group.subject.name}</span>
          </div>
        </div>

        <div>
          <Button
            asChild
            variant="outline"
            className="h-9 px-4 rounded-xl flex items-center gap-2 text-slate-600 hover:text-slate-800"
          >
            <Link href="/dashboard/instructor/attendance">
              <ArrowRight className="size-4" />
              <span>رجوع للمجموعات</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <AttendanceTab groupId={group.id} totalStudents={group.students.length} />
      </div>
    </div>
  );
}
