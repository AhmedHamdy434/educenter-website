export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4" dir="rtl">
      <div className="relative flex items-center justify-center mb-4">
        {/* Premium Spinner */}
        <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-[#1E4632] animate-spin" />
      </div>
      <p className="text-slate-500 text-sm font-medium animate-pulse">جاري تحميل البيانات...</p>
    </div>
  );
}
