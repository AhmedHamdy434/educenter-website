import React from "react";
import Image from "next/image";
import { Star, Play, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, ScaleIn } from "@/components/common/motion-wrapper";

export function Hero() {
  return (
    <section id="hero" className="relative isolate w-full pt-7 pb-15 md:py-15 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          }}
          className="relative left-[calc(50%+2rem)] aspect-1155/678 w-144.5 -translate-x-1/2 -translate-y-1/2 rotate-30 bg-linear-to-br from-[#1E4632] via-emerald-400 to-[#E5A93B] opacity-15 sm:left-[calc(50%+2rem)] sm:w-6xl"
        ></div>
      </div>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: Text Details */}
          <FadeIn
            direction="right"
            delay={0.1}
            className="lg:col-span-6 order-2 lg:order-1 flex flex-col items-center lg:items-start space-y-6 z-10"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFBEB] border border-[#FDE047] text-slate-800 text-xs sm:text-sm font-semibold shadow-xs">
              <Star className="size-4 text-[#E5A93B] fill-[#E5A93B]" />
              <span className="text-[#1E4632]">نظام متكامل لإدارة مركز التعليم</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E4632] leading-[1.2] tracking-tight">
              إدارة أسهل 
              <br className="hidden lg:block" />{" "}
              <span className="text-slate-800">تعليم أفضل</span>
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed">
              منصة شاملة تساعدك على إدارة طلابك، معلميك، الدروس، الاختبارات، والتقارير في مكان واحد بكل سهولة واحترافية.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Button variant="brand" size="brandXl" className="font-semibold shadow-md shadow-[#1E4632]/10">
                ابدأ الآن مجاناً
              </Button>
              <Button
                variant="outline"
                size="brandXl"
                className="border-slate-200 hover:border-slate-300 text-slate-700 font-medium gap-2"
              >
                <div className="flex size-6 items-center justify-center rounded-full bg-[#F0F7F4] text-[#1E4632]">
                  <Play className="size-3 fill-[#1E4632] translate-x-[-0.5px]" />
                </div>
                شاهد الفيديو
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3 space-x-reverse">
                <div className="relative size-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                  <Image src="/images/avatar-ahmed.png" alt="User Avatar" fill sizes="40px" className="object-cover" />
                </div>
                <div className="relative size-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                  <Image src="/images/avatar-sara.png" alt="User Avatar" fill sizes="40px" className="object-cover" />
                </div>
                <div className="relative size-10 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                  <Image src="/images/avatar-mohammed.png" alt="User Avatar" fill sizes="40px" className="object-cover" />
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[14px] font-bold text-slate-800">أكثر من +10,000 مركز تعليمي</span>
                <span className="text-xs text-slate-400">يثقون بنا حول الوطن العربي</span>
              </div>
            </div>
          </FadeIn>

          {/* Left Column: Visual Student Image */}
          <ScaleIn
            delay={0.3}
            className="lg:col-span-6 order-1 lg:order-2 flex items-center justify-center relative w-full aspect-square max-w-[500px] lg:max-w-none mx-auto"
          >
            {/* Soft yellow circle blob behind student */}
            <div className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-full bg-[#FEF4E3]/90 -z-10 animate-pulse duration-8000" />

            {/* Floating decoration 1: Graduation cap (top right) */}
            <div className="absolute top-[8%] right-[8%] p-3.5 rounded-2xl bg-white shadow-xl shadow-slate-200/40 text-amber-500 animate-bounce duration-4000">
              <Award className="size-6" />
            </div>

            {/* Floating decoration 2: Book (bottom left) */}
            <div className="absolute bottom-[10%] left-[5%] p-3.5 rounded-2xl bg-white shadow-xl shadow-slate-200/40 text-[#1E4632] -rotate-12 hover:rotate-0 transition-transform">
              <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10M6 10h10M6 14h10" />
              </svg>
            </div>

            {/* Floating decoration 3: Grid dots (top left) */}
            <div className="absolute top-[12%] left-[10%] opacity-20 -z-10 select-none">
              <div className="grid grid-cols-4 gap-2">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="size-1.5 rounded-full bg-[#1E4632]" />
                ))}
              </div>
            </div>

            {/* Main Student Image */}
            <div className="relative w-[78%] h-[78%] rounded-b-[100px] rounded-t-[150px] overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/images/hero-student.png"
                alt="EduCenter Student"
                fill
                priority
                sizes="(max-width: 1024px) 78vw, 39vw"
                className="object-cover"
              />
            </div>
          </ScaleIn>

        </div>
      </div>
    </section>
  );
}
