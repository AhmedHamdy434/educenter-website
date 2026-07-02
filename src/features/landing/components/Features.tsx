import React from "react";
import { Laptop, MessageSquare, Shield, Users, PieChart } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/common/motion-wrapper";

export function Features() {
  const features = [
    {
      title: "متاح في أي وقت",
      description: "من أي مكان وفي أي وقت عبر جميع الأجهزة الذكية والأجهزة المحمولة.",
      icon: Laptop,
      color: "green", // #1E4632
    },
    {
      title: "تواصل فعال",
      description: "تواصل مستمر وسريع مع الطلاب وأولياء الأمور لضمان سير العملية التعليمية.",
      icon: MessageSquare,
      color: "amber", // #E5A93B
    },
    {
      title: "آمن وموثوق",
      description: "حماية كاملة لبياناتك وبيانات طلابك ومعلميك بأعلى معايير الأمان والتشفير.",
      icon: Shield,
      color: "green",
    },
    {
      title: "إدارة شاملة",
      description: "إدارة الطلاب، المعلمين، الحضور، الغياب، الدروس، والامتحانات بكل سهولة.",
      icon: Users,
      color: "amber",
    },
    {
      title: "تقارير ذكية",
      description: "تقارير تفصيلية وإحصاءات دقيقة لتساعدك على اتخاذ القرارات وتحسين أداء مركزك.",
      icon: PieChart,
      color: "green",
    },
  ];

  return (
    <section id="features" className="w-full bg-slate-50/60 py-20 border-y border-slate-100">
      <div className="container">
        
        {/* Section Header */}
        <FadeIn direction="up" className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0F7F4] text-[#1E4632] font-semibold">
            لماذا تختارنا؟
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E4632] tracking-tight">
            مميزات تساعدك على النمو والنجاح
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            تم تصميم منصة EduCenter لتغطي كافة الاحتياجات الإدارية والتعليمية للمراكز والمنشآت التعليمية بكفاءة عالية.
          </p>
        </FadeIn>

        {/* Features Grid */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            const isGreen = feature.color === "green";
            return (
              <StaggerItem key={idx} direction="up" className="h-full">
                <HoverCard
                  className="group flex flex-col items-center text-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200/80 transition-all duration-300 h-full"
                >
                  {/* Icon Wrapper */}
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-6 shadow-sm transition-all duration-300 group-hover:scale-110 ${
                      isGreen
                        ? "bg-[#F0F7F4] text-[#1E4632] group-hover:bg-[#1E4632] group-hover:text-white"
                        : "bg-[#FFFBEB] text-[#E5A93B] group-hover:bg-[#E5A93B] group-hover:text-white"
                    }`}
                  >
                    <Icon className="size-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-[#1E4632] text-lg mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

      </div>
    </section>
  );
}
