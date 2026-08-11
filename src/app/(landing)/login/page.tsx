import Image from "next/image";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "تسجيل الدخول - EduCenter",
  description: "سجل الدخول إلى حسابك في منصة EduCenter لإدارة السنتر التعليمي الخاص بك.",
};

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">


      {/* Main split-screen container */}
      <div className="grow grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-80px)] z-10">
        {/* Right side: Green background with illustration/marketing copy on large screens */}
        <div className="hidden lg:flex lg:col-span-5 bg-[#1E4632] relative overflow-hidden flex-col justify-between p-12 text-white">
          {/* Decorative blur shapes inside the green area */}
          <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square rounded-full bg-emerald-600/30 filter blur-3xl opacity-80" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] aspect-square rounded-full bg-emerald-800/30 filter blur-3xl opacity-80" />
          </div>

          <div className="relative z-10 space-y-6 max-w-lg">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              منصة EduCenter الذكية
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight">
              أدر مركزك التعليمي بكل سهولة واحترافية في مكان واحد
            </h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              انضم إلى آلاف المعلمين وأصحاب المراكز الذين يثقون في EduCenter لإدارة حصصهم، طلابهم، اختباراتهم، ومستنداتهم بأعلى كفاءة وأقل مجهود.
            </p>
          </div>

          {/* Premium Illustration */}
          <div className="relative z-10 w-full aspect-16/10 min-h-55 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-emerald-950/20 max-w-lg my-8">
            <Image
              src="/images/login-illustrations.png"
              alt="EduCenter Dashboard Illustration"
              fill
              sizes="(max-width: 1024px) 100vw, 35vw"
              priority
              className="object-cover"
            />
          </div>

          <div className="relative z-10 text-xs text-emerald-200/60 font-medium">
            جميع الحقوق محفوظة © EduCenter {new Date().getFullYear()}
          </div>
        </div>

        {/* Left side: LoginForm */}
        <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-50 relative">
          {/* Decorative background shapes for left column */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 lg:hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] aspect-square rounded-full bg-[#F0F7F4] filter blur-3xl opacity-60" />
          </div>

          <div className="relative z-10 w-full">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
