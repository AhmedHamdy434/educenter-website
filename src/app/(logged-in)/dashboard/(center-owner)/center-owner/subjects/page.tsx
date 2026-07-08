import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المواد الدراسية | مدير المركز",
};

export default function OwnerSubjectsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">إدارة المواد الدراسية</h1>
        <p className="text-slate-500 text-sm">عرض وإعداد المناهج والمواد الدراسية المتوفرة.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة إدارة المواد الدراسية</p>
      </div>
    </div>
  );
}
