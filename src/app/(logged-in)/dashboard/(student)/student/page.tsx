import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | الطالب",
};

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
        <p className="text-slate-500 text-sm">مرحباً بك في لوحة التحكم الخاصة بك كطالب.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة لوحة التحكم</p>
      </div>
    </div>
  );
}
