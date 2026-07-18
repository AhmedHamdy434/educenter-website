import { type Student } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ColumnsProps {
  onEdit: (student: Student) => void;
  onViewPayments: (student: Student) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
}

export function getStudentColumns({
  onEdit,
  onViewPayments,
  onToggleStatus,
  togglingId,
}: ColumnsProps) {
  return [
    {
      accessorKey: "user.fullName",
      header: "الطالب",
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="flex flex-col text-right">
          <span className="font-semibold text-slate-800">
            {row.original.user.fullName}
          </span>
          <span className="text-xs text-slate-400">
            {row.original.user.email}
          </span>
        </div>
      ),
    },
    {
      id: "grade",
      header: "المرحلة الدراسية",
      cell: ({ row }: { row: { original: Student } }) => {
        const activeEnrollment = row.original.enrollments?.find((e) => e.isActive);
        return (
          <span className="font-medium text-[#1E4632] bg-[#F0F7F4] px-2.5 py-1 rounded-full text-xs border border-[#1E4632]/10">
            {activeEnrollment?.grade.name || "غير مسجل"}
          </span>
        );
      },
    },
    {
      accessorKey: "user.phone",
      header: "الهاتف",
      cell: ({ row }: { row: { original: Student } }) => (
        <span className="text-slate-600 font-mono text-xs block" dir="ltr">
          {row.original.user.phone}
        </span>
      ),
    },
    {
      accessorKey: "parentPhone",
      header: "هاتف ولي الأمر",
      cell: ({ row }: { row: { original: Student } }) => (
        <span className="text-slate-600 font-mono text-xs block" dir="ltr">
          {row.original.parentPhone}
        </span>
      ),
    },
    {
      accessorKey: "notes",
      header: "ملاحظات",
      cell: ({ row }: { row: { original: Student } }) => (
        <span
          className="text-slate-500 max-w-xs truncate block"
          title={row.original.notes || ""}
        >
          {row.original.notes || "لا توجد ملاحظات"}
        </span>
      ),
    },
    {
      accessorKey: "user.isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Student } }) => (
        <Switch
          checked={row.original.user.isActive}
          onCheckedChange={() => onToggleStatus(row.original.id)}
          disabled={togglingId === row.original.id}
          aria-label="تغيير حالة التفعيل"
        />
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }: { row: { original: Student } }) => (
        <div className="flex gap-2 justify-center">
          <Button
            onClick={() => onEdit(row.original)}
            variant="brandOutline"
            size="sm"
            className="h-8 rounded-lg text-[#1E4632] border-[#1E4632]/20 hover:bg-[#F0F7F4]"
          >
            تعديل
          </Button>
          <Button
            onClick={() => onViewPayments(row.original)}
            variant="ghost"
            size="sm"
            className="h-8 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200/50"
          >
            المدفوعات
          </Button>
        </div>
      ),
    },
  ];
}
