import Image from "next/image";
import { Quote } from "lucide-react";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/common/motion-wrapper";

export function Testimonials() {
  const reviews = [
    {
      text: "الاختبارات الإلكترونية وفرت علينا مجهود كبير في التصحيح والمتابعة.",
      name: "أ. أحمد خالد",
      role: "مدير مركز النجاح",
      avatar: "/images/avatar-ahmed.png",
    },
    {
      text: "أصبح التواصل مع الطلاب وأولياء الأمور أسهل بكثير.. أنصح كل المراكز باستخدامه.",
      name: "أ. سارة اليوسف",
      role: "مديرة مركز النخبة",
      avatar: "/images/avatar-sara.png",
    },
    {
      text: "النظام سهل الاستخدام ووفر علينا وقت كبير في إدارة المركز.. التقارير رائعة!",
      name: "أ. محمد الشمري",
      role: "مدير مركز قرطبة التعليمي",
      avatar: "/images/avatar-mohammed.png",
    },
  ];

  return (
    <section
      id="testimonials"
      className="w-full bg-slate-50/50 py-20 border-t border-slate-100"
    >
      <div className="container">
        {/* Section Header */}
        <FadeIn
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E4632] tracking-tight">
            ماذا يقول عملاؤنا؟
          </h2>
          <div className="h-1 w-16 bg-[#E5A93B] rounded-full mx-auto" />
        </FadeIn>

        {/* Testimonials Grid */}
        <StaggerContainer
          staggerDelay={0.12}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviews.map((review, idx) => {
            return (
              <StaggerItem key={idx} direction="up" className="h-full">
                <HoverCard className="group flex flex-col justify-between p-8 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/80 transition-all duration-300 h-full">
                  {/* Quote Icon */}
                  <div className="text-[#1E4632]/10 mb-6 group-hover:text-[#1E4632]/25 transition-colors">
                    <Quote className="size-8 stroke-3" />
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-600 text-[15px] leading-relaxed mb-8 text-right font-medium animate-none">
                    {review.text}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3.5 pt-6 border-t border-slate-50 mt-auto">
                    <div className="relative size-12 rounded-full overflow-hidden bg-slate-100 border-2 border-[#F0F7F4]">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="font-bold text-slate-800 text-[15px]">
                        {review.name}
                      </span>
                      <span className="text-xs text-slate-400 font-medium mt-0.5">
                        {review.role}
                      </span>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
