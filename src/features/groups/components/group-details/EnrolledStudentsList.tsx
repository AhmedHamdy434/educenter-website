"use client";

import { useState, useMemo } from "react";
import { Users, UserMinus, CreditCard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/common/TableSearch";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { type GroupDetails } from "../../types";

interface EnrolledStudentsListProps {
  students: GroupDetails["students"];
  onRemoveStudent: (studentId: string) => void;
  isRemovePending: boolean;
  showRemoveButton?: boolean;
  onViewPayments?: (studentId: string, studentName: string) => void;
}

export function EnrolledStudentsList({
  students,
  onRemoveStudent,
  isRemovePending,
  showRemoveButton = true,
  onViewPayments,
}: EnrolledStudentsListProps) {
  const [studentSearch, setStudentSearch] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Client-side search for enrolled students
  const filteredEnrolledStudents = useMemo(() => {
    return students.filter(
      (item) =>
        item.student.user.fullName.toLowerCase().includes(studentSearch.toLowerCase()) ||
        item.student.user.phone.includes(studentSearch) ||
        (item.student.parentPhone && item.student.parentPhone.includes(studentSearch))
    );
  }, [students, studentSearch]);

  const handleOpenConfirm = (studentId: string) => {
    setSelectedStudentId(studentId);
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setSelectedStudentId(null);
    setIsConfirmOpen(false);
  };

  const handleConfirmRemove = async () => {
    if (selectedStudentId) {
      await onRemoveStudent(selectedStudentId);
      handleCloseConfirm();
    }
  };

  // Find the selected student's name for confirmation message
  const selectedStudentName = useMemo(() => {
    if (!selectedStudentId) return "";
    const item = students.find((s) => s.student.id === selectedStudentId);
    return item ? item.student.user.fullName : "";
  }, [students, selectedStudentId]);

  return (
    <>
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Users className="size-5 text-[#1E4632]" />
            الطلاب المسجلون ({students.length})
          </h2>

          <div className="w-full sm:w-64">
            <TableSearch
              placeholder="ابحث عن طالب..."
              value={studentSearch}
              onChange={setStudentSearch}
            />
          </div>
        </div>

        {/* Students Table */}
        {filteredEnrolledStudents.length > 0 ? (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold">
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">هاتف ولي الأمر</th>
                  <th className="p-4">تاريخ الانضمام</th>
                  {(showRemoveButton || !!onViewPayments) && <th className="p-4 text-center">الإجراءات</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredEnrolledStudents.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex flex-col">
                        <span>{item.student.user.fullName}</span>
                        <span className="text-xs text-slate-400 font-normal">
                          {item.student.user.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">{item.student.user.phone}</td>
                    <td className="p-4">{item.student.parentPhone || "—"}</td>
                    <td className="p-4 text-slate-400 text-xs">
                      {new Date(item.joinedAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </td>
                    {(showRemoveButton || !!onViewPayments) && (
                      <td className="p-4 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          {onViewPayments && (
                            <Button
                              onClick={() => onViewPayments(item.student.id, item.student.user.fullName)}
                              variant="ghost"
                              size="icon"
                              title="عرض سجل المدفوعات"
                              className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg animate-none"
                            >
                              <CreditCard className="size-4" />
                            </Button>
                          )}
                          {showRemoveButton && (
                            <Button
                              onClick={() => handleOpenConfirm(item.student.id)}
                              variant="ghost"
                              size="icon"
                              title="إلغاء التسجيل"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                              disabled={isRemovePending}
                            >
                              <UserMinus className="size-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/10">
            <Users className="size-12 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold text-slate-500">لا يوجد طلاب مسجلون</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {studentSearch
                ? "لم يتم العثور على أي طلاب يطابقون بحثك الحالي."
                : "هذه المجموعة فارغة حالياً. اضغط على زر إدراج طلاب لإضافة طلاب من نفس المرحلة."}
            </p>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Alert Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={handleCloseConfirm}
        onConfirm={handleConfirmRemove}
        title="إلغاء تسجيل طالب"
        description={`هل أنت متأكد من إلغاء تسجيل الطالب "${selectedStudentName}" من هذه المجموعة الدراسية؟`}
        confirmText="إلغاء التسجيل"
        cancelText="تراجع"
        isLoading={isRemovePending}
      />
    </>
  );
}
