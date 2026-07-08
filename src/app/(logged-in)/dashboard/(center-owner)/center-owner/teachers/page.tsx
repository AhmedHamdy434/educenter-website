import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "المعلمون | مدير المركز",
};

export default function OwnerTeachersPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">إدارة المعلمين</h1>
        <p className="text-slate-500 text-sm">عرض وإدارة المعلمين المسجلين في المركز.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة إدارة المعلمين</p>
      </div>
    </div>
  );
}
