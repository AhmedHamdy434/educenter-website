import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الواجبات | الطالب",
};

export default function StudentAssignmentsPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">واجباتي</h1>
        <p className="text-slate-500 text-sm">عرض الواجبات المدرسية المطلوبة وحالة تسليمها.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة واجباتي والأنشطة</p>
      </div>
    </div>
  );
}
