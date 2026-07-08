import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاشتراك | مدير المركز",
};

export default function OwnerSubscriptionPage() {
  return (
    <div className="space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-800">تفاصيل الاشتراك</h1>
        <p className="text-slate-500 text-sm">عرض معلومات خطة الاشتراك الحالية والفوترة.</p>
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <p className="text-slate-700 font-medium">محتوى صفحة تفاصيل الاشتراك</p>
      </div>
    </div>
  );
}
