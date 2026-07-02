"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap, Eye, EyeOff, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/common/form-input";
import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import { loginAction } from "../actions/login";
import { FadeIn, ScaleIn } from "@/components/common/motion-wrapper";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    clearErrors("root");
    try {
      const result = await loginAction(data);

      if (result.success) {
        // Redirect to homepage/dashboard and refresh the router context to pick up the token cookie
        router.push("/");
        router.refresh();
      } else {
        setError("root", {
          message: result.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك والمحاولة مجدداً.",
        });
      }
    } catch (error) {
      console.error("Login submission error:", error);
      setError("root", {
        message: "عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.",
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" dir="rtl">
      <FadeIn direction="up" duration={0.6}>
        {/* Card Container */}
        <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-xl shadow-slate-100/50">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#1E4632] hover:opacity-90 transition-opacity"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-[#F0F7F4] text-[#1E4632]">
                <GraduationCap className="size-6 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-xl tracking-tight">EduCenter</span>
            </Link>
            <h2 className="text-2xl font-bold text-[#1e4632] tracking-tight">تسجيل الدخول للمنصة</h2>
            <p className="text-slate-500 text-sm">أدخل بريدك الإلكتروني أو رقم الهاتف للمتابعة</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Global Errors Banner */}
            {errors.root && (
              <ScaleIn className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl text-sm">
                <AlertTriangle className="size-5 shrink-0 text-red-600" />
                <span>{errors.root.message}</span>
              </ScaleIn>
            )}

            <div className="space-y-4">
              {/* Identifier Input */}
              <FormInput
                type="text"
                id="identifier"
                label="البريد الإلكتروني أو رقم الهاتف"
                placeholder="admin@educenter.com أو 01xxxxxxxxx"
                className="text-left dir-ltr"
                error={errors.identifier?.message}
                disabled={isSubmitting}
                {...register("identifier")}
              />

              {/* Password Input with Visibility Toggle */}
              <div className="relative">
                <FormInput
                  type={showPassword ? "text" : "password"}
                  id="password"
                  label="كلمة المرور"
                  placeholder="••••••••"
                  className="text-left dir-ltr pl-12"
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  className="absolute left-4 top-[38px] text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="brand"
              disabled={isSubmitting}
              className="w-full py-6 font-bold flex items-center justify-center gap-2 shadow-md shadow-[#1e4632]/10 rounded-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  <span>جاري تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#1E4632] font-semibold transition-colors group"
            >
              <ArrowRight className="size-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
