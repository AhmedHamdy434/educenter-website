import Link from "next/link";
import { type Group } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";
import { DAY_NAMES_AR, formatTime } from "@/utils/time";

interface ColumnsProps {
  onEdit: (group: Group) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
  deletingId: string | null;
}

export function getGroupColumns({
  onEdit,
  onDelete,
  onToggleStatus,
  togglingId,
  deletingId,
}: ColumnsProps) {
  return [
    {
      accessorKey: "name",
      header: "المجموعة",
      cell: ({ row }: { row: { original: Group } }) => (
        <div className="flex flex-col text-right">
          <Link
            href={`/dashboard/center-owner/groups/${row.original.id}`}
            className="font-semibold text-[#1E4632] hover:underline"
          >
            {row.original.name}
          </Link>
          <span className="text-xs text-slate-400">
            {row.original.grade.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "subject.name",
      header: "المادة",
      cell: ({ row }: { row: { original: Group } }) => (
        <span className="font-medium text-slate-700">
          {row.original.subject.name}
        </span>
      ),
    },
    {
      accessorKey: "teacher.user.fullName",
      header: "المعلم",
      cell: ({ row }: { row: { original: Group } }) => (
        <span className="text-slate-600 font-medium text-sm">
          {row.original.teacher.user.fullName}
        </span>
      ),
    },
    {
      id: "studentsCount",
      header: "الطلاب / السعة",
      cell: ({ row }: { row: { original: Group } }) => {
        const enrolled = row.original._count?.students ?? 0;
        const capacity = row.original.capacity;
        return (
          <span className="text-sm font-semibold text-slate-700">
            {enrolled} {capacity ? `/${capacity}` : ""}
          </span>
        );
      },
    },
    {
      id: "schedule",
      header: "المواعيد الأسبوعية",
      cell: ({ row }: { row: { original: Group } }) => {
        const schedule = row.original.schedule || [];
        if (schedule.length === 0)
          return <span className="text-slate-400 text-xs">غير محدد</span>;
        return (
          <div className="flex flex-wrap gap-1 max-w-xs justify-start">
            {schedule.map((item, idx) => (
              <span
                key={item.id || idx}
                className="inline-block bg-[#1E4632]/5 border border-[#1E4632]/10 rounded-md px-2 py-0.5 text-xs text-[#1E4632] font-semibold"
              >
                {DAY_NAMES_AR[item.day]} {formatTime(item.hour, item.minute)}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Group } }) => (
        <Switch
          checked={row.original.isActive}
          onCheckedChange={() => onToggleStatus(row.original.id)}
          disabled={togglingId === row.original.id}
          aria-label="تغيير حالة التفعيل"
        />
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }: { row: { original: Group } }) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onEdit(row.original)}
            variant="brandOutline"
            size="sm"
            className="h-8 rounded-lg text-[#1E4632] border-[#1E4632]/20 hover:bg-[#F0F7F4]"
          >
            تعديل
          </Button>
          <Button
            onClick={() => {
              if (confirm("هل أنت متأكد من حذف هذه المجموعة الدراسية نهائياً؟")) {
                onDelete(row.original.id);
              }
            }}
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
            disabled={deletingId === row.original.id}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
