import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FadeIn, ScaleIn } from "@/components/common/motion-wrapper";

export function CTA() {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Banner Box */}
        <div className="relative w-full bg-[#1E4632] rounded-3xl md:rounded-[2.5rem] overflow-hidden px-8 py-14 md:p-16 lg:p-20 shadow-xl shadow-[#1E4632]/10">
          {/* Decorative Vector: Paper Airplane & Dashed Line */}
          <div className="absolute top-[10%] left-[25%] opacity-15 hidden md:block select-none">
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              fill="none"
              className="text-white"
            >
              <path
                d="M10 70 C30 50, 45 40, 70 50 C95 60, 105 40, 110 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path d="M110 20 L102 24 L108 28 Z" fill="currentColor" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Right Column: Text & CTA Details (in RTL, it is right) */}
            <FadeIn
              direction="right"
              delay={0.1}
              className="lg:col-span-7 flex flex-col items-start text-right space-y-6 z-10 text-white"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
                جاهز للانطلاق؟
              </h2>
              <p className="text-white/85 text-base sm:text-lg max-w-lg leading-relaxed">
                انضم إلى آلاف المراكز التعليمية التي تدير أعمالها بسهولة
                واحترافية مع EduCenter.
              </p>

              <div className="flex flex-col items-start gap-2.5 w-full sm:w-auto">
                <Button
                  variant="brandWhite"
                  size="brandXl"
                  className="font-bold"
                >
                  ابدأ تجربتك المجانية الآن
                </Button>
                <span className="text-[12px] text-white/60 font-medium pr-2">
                  * لا نحتاج إلى بطاقة ائتمان لتسجيل الاشتراك.
                </span>
              </div>
            </FadeIn>

            {/* Left Column: Visual Student Image */}
            <ScaleIn
              delay={0.25}
              className="lg:col-span-5 relative w-full aspect-4/3 md:aspect-square max-w-[400px] lg:max-w-none mx-auto flex items-end justify-center"
            >
              {/* Floating decorative items inside green box */}
              <div className="absolute top-[8%] left-[10%] p-2 rounded-xl bg-white/10 text-white/90 rotate-15">
                <svg
                  className="size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>

              {/* White overlay border shape for student image */}
              <div className="relative w-[85%] h-[85%] rounded-b-2xl rounded-t-[80px] overflow-hidden border-4 border-white/20 shadow-2xl">
                <Image
                  src="/images/cta-student.png"
                  alt="EduCenter Learning Support"
                  fill
                  sizes="(max-width: 1024px) 85vw, 35vw"
                  className="object-cover object-top"
                />
              </div>
            </ScaleIn>
          </div>
        </div>
      </div>
    </section>
  );
}
