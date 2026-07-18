import React from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { AttendanceStatus, type StudentAttendanceHistoryItem } from "../types";

const STATUS_CONFIG = {
  [AttendanceStatus.PRESENT]: {
    label: "حاضر",
    className: "bg-green-50 text-green-700 border-green-200",
    icon: CheckCircle,
  },
  [AttendanceStatus.ABSENT]: {
    label: "غائب",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
  [AttendanceStatus.LATE]: {
    label: "متأخر",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  [AttendanceStatus.EXCUSED]: {
    label: "مستأذن",
    className: "bg-slate-50 text-slate-700 border-slate-200",
    icon: AlertCircle,
  },
};

export function getStudentAttendanceColumns() {
  return [
    {
      accessorKey: "date",
      header: "تاريخ الحصة",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="font-semibold text-slate-800">
          {new Date(row.original.date).toLocaleDateString("ar-EG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      accessorKey: "groupName",
      header: "المجموعة الدراسية",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="font-medium text-slate-700">
          {row.original.groupName}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "حالة الحضور",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => {
        const cfg = STATUS_CONFIG[row.original.status] || {
          label: row.original.status,
          className: "bg-slate-50 text-slate-500",
          icon: HelpCircleIcon,
        };
        const IconComponent = cfg.icon;
        return (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.className}`}
          >
            <IconComponent className="size-3.5" />
            <span>{cfg.label}</span>
          </span>
        );
      },
    },
    {
      accessorKey: "absenceReason",
      header: "ملاحظات / عذر الغياب",
      cell: ({ row }: { row: { original: StudentAttendanceHistoryItem } }) => (
        <span className="text-xs text-slate-500">
          {row.original.absenceReason || (
            <span className="text-slate-300 italic">لا توجد ملاحظات</span>
          )}
        </span>
      ),
    },
  ];
}

function HelpCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
