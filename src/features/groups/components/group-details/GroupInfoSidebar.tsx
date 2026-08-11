"use client";

import {
  BookOpen,
  GraduationCap,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { type GroupDetails } from "../../types";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface GroupInfoSidebarProps {
  group: GroupDetails;
  isTeacher: boolean;
}

export function GroupInfoSidebar({ group, isTeacher }: GroupInfoSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Card 1: Main Info */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
          <BookOpen className="size-4 text-[#1E4632]" />
          بيانات المجموعة الأساسية
        </h3>

        <div className="space-y-3.5 text-slate-600 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">الصف الدراسي</span>
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <GraduationCap className="size-4 text-slate-400" />
              {group.grade.name}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">المادة الدراسية</span>
            <span className="font-semibold text-slate-700">
              {group.subject.name}
            </span>
          </div>

          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <span className="text-slate-400">السعة الاستيعابية</span>
            <span className="font-semibold text-slate-700">
              {group.capacity ? `${group.capacity} طالب` : "غير محدودة (∞)"}
            </span>
          </div>

          {group.capacity && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400">المقاعد المتبقية</span>
              <span
                className={`font-semibold ${
                  group.capacity - group.students.length <= 0
                    ? "text-red-500 font-bold"
                    : "text-slate-700"
                }`}
              >
                {Math.max(0, group.capacity - group.students.length)} مقعد
              </span>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-50 pt-3">
            <span className="text-slate-400">سعر الاشتراك الشهري</span>
            <span className="font-semibold text-[#1E4632] bg-[#F0F7F4] px-2.5 py-1 rounded-full text-xs border border-[#1E4632]/10">
              {group.monthlyFee ? `${group.monthlyFee} ج.م` : "مجاني"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">تاريخ بداية المجموعة</span>
            <span className="font-semibold text-slate-700 font-mono text-xs">
              {group.startDate
                ? new Date(group.startDate).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">مدة المجموعة</span>
            <span className="font-semibold text-slate-700">
              {group.monthsCount ? `${group.monthsCount} أشهر` : "—"}
            </span>
          </div>
        </div>
      </Card>

      {/* Card 2: Teacher Info */}
      {!isTeacher && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <User className="size-4 text-[#1E4632]" />
            المعلم المسؤول
          </h3>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-base flex-shrink-0">
              {group.teacher.user.fullName.substring(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-slate-800 text-sm truncate">
                {group.teacher.user.fullName}
              </span>
              <span className="text-xs text-slate-400 truncate">
                {group.teacher.specialization || "معلم المادة"}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-slate-500 text-xs border-t border-slate-50 pt-3">
            <div className="flex items-center gap-2">
              <Phone className="size-3.5 text-slate-400" />
              <span>{group.teacher.user.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-slate-400" />
              <span className="truncate">{group.teacher.user.email}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Card 3: Schedules */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
          <Calendar className="size-4 text-[#1E4632]" />
          جدول المواعيد الأسبوعي
        </h3>

        {group.schedule && group.schedule.length > 0 ? (
          <div className="space-y-2">
            {group.schedule.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/30 text-xs font-semibold text-slate-700"
              >
                <span>{DAY_NAMES_AR[item.day]}</span>
                <span>{formatTime(item.hour, item.minute)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            لا توجد مواعيد محددة لهذه المجموعة بعد.
          </p>
        )}
      </Card>
    </div>
  );
}
