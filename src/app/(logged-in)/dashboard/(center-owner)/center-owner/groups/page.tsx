import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المجموعات | مدير المركز",
};

export default function OwnerGroupsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">إدارة المجموعات</h1>
        <p className="text-slate-500 text-sm">عرض وتنظيم المجموعات والحصص الدراسية.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة إدارة المجموعات</p>
      </div>
    </div>
  );
}
