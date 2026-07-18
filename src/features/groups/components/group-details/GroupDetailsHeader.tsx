"use client";

import Link from "next/link";
import { ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GroupDetailsHeaderProps {
  groupName: string;
  isActive: boolean;
  onOpenAddModal: () => void;
  showAddButton?: boolean;
}

export function GroupDetailsHeader({
  groupName,
  isActive,
  onOpenAddModal,
  showAddButton = true,
}: GroupDetailsHeaderProps) {
  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <Link
          href="/dashboard/center-owner/groups"
          className="hover:text-slate-800 transition-colors flex items-center gap-1"
        >
          المجموعات الدراسية
        </Link>
        <ChevronRight className="size-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">{groupName}</span>
      </div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {groupName}
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                isActive
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {isActive ? "نشطة" : "معطلة"}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إدارة الطلاب وتفاصيل المواعيد الخاصة بهذه المجموعة.
          </p>
        </div>

        {showAddButton && (
          <Button
            onClick={onOpenAddModal}
            variant="brand"
            className="h-10 rounded-xl flex items-center gap-2 self-start md:self-auto"
          >
            <UserPlus className="size-4" />
            إدراج طلاب في المجموعة
          </Button>
        )}
      </div>
    </div>
  );
}
