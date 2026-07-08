import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4" dir="rtl">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F7F4] text-[#1E4632] mb-6">
        <FileQuestion className="size-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 mb-2">الصفحة غير موجودة</h1>
      <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التأكد من الرابط والمحاولة مجدداً.
      </p>
      <Button asChild variant="brand" size="brandMd">
        <Link href="/dashboard">العودة للوحة التحكم</Link>
      </Button>
    </div>
  );
}
