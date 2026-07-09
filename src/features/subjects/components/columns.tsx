import { type Subject } from "../types";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ColumnsProps {
  onEdit: (subject: Subject) => void;
  onToggleStatus: (id: string) => void;
  togglingId: string | null;
}

export function getSubjectColumns({
  onEdit,
  onToggleStatus,
  togglingId,
}: ColumnsProps) {
  return [
    {
      id: "index",
      header: "#",
      cell: ({ row }: { row: { index: number } }) => (
        <span className="inline-flex items-center justify-center rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 border border-slate-100">
          {row.index + 1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "اسم المادة الدراسية",
      cell: ({ row }: { row: { original: Subject } }) => (
        <span className="font-semibold text-slate-800">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "grade.name",
      header: "المرحلة الدراسية",
      cell: ({ row }: { row: { original: Subject } }) => (
        <span className="font-medium text-[#1E4632] bg-[#F0F7F4] px-2.5 py-1 rounded-full text-xs border border-[#1E4632]/10">
          {row.original.grade?.name || "غير محددة"}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "الوصف",
      cell: ({ row }: { row: { original: Subject } }) => (
        <span
          className="text-slate-500 max-w-xs truncate block"
          title={row.original.description || ""}
        >
          {row.original.description || "لا يوجد وصف"}
        </span>
      ),
    },
    {
      accessorKey: "isActive",
      header: "الحالة",
      cell: ({ row }: { row: { original: Subject } }) => (
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
      cell: ({ row }: { row: { original: Subject } }) => (
        <Button
          onClick={() => onEdit(row.original)}
          variant="brandOutline"
          size="sm"
          className="h-8 rounded-lg text-[#1E4632] border-[#1E4632]/20 hover:bg-[#F0F7F4]"
        >
          تعديل
        </Button>
      ),
    },
  ];
}
