import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn, HoverCard } from "@/components/common/motion-wrapper";

export function Pricing() {
  const plans = [
    {
      name: "الباقة الأساسية",
      description: "مناسبة للمعلمين المستقلين والمجموعات الصغيرة التي تبدأ رحلتها.",
      price: "199",
      period: "شهرياً",
      isPopular: false,
      features: [
        "حتى 100 طالب مسجل",
        "إدارة حتى 5 مجموعات دراسية",
        "تسجيل الحضور والغياب اليومي",
        "تقارير الحضور الأساسية",
        "دعم فني عبر البريد الإلكتروني",
      ],
      buttonText: "ابدأ الآن مجاناً",
      buttonVariant: "brandOutline" as const,
      href: "/login",
    },
    {
      name: "الباقة الاحترافية",
      description: "الخيار الأفضل للسناتر والمراكز التعليمية المتوسطة والنامية.",
      price: "399",
      period: "شهرياً",
      isPopular: true,
      features: [
        "حتى 500 طالب مسجل",
        "عدد غير محدود من المجموعات",
        "إدارة رواتب ونسب المعلمين",
        "تحصيل الاشتراكات والمدفوعات",
        "إرسال تنبيهات ورسائل للطلاب",
        "تقارير وإحصائيات متقدمة",
        "دعم فني مباشر وسريع 24/7",
      ],
      buttonText: "ابدأ التجربة المجانية",
      buttonVariant: "brand" as const,
      href: "/login",
    },
    {
      name: "باقة المؤسسات",
      description: "حل مخصص للمجمعات التعليمية الكبرى وفروع السناتر المتعددة.",
      price: "799",
      period: "شهرياً",
      isPopular: false,
      features: [
        "عدد غير محدود من الطلاب",
        "إدارة فروع وسناتر متعددة",
        "صلاحيات مخصصة للمشرفين والمحاسبين",
        "تطبيق مخصص للسنتر باسمك وشعارك",
        "تكامل مع أنظمة الدفع وبوابات الرسائل",
        "مدير حساب مخصص وتدريب كامل",
      ],
      buttonText: "تواصل معنا للمؤسسات",
      buttonVariant: "brandOutline" as const,
      href: "#contact",
    },
  ];

  return (
    <section id="pricing" className="w-full py-20 bg-background" dir="rtl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-accent text-xs font-bold border border-border">
            <Crown className="size-3.5 fill-accent" />
            <span>باقات تناسب جميع الأحجام</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            خطط أسعار واضحة وبسيطة
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed font-medium">
            اختر الخطة المناسبة لحجم مركزك التعليمي وابدأ في تنظيم وإدارة عملك بكفاءة من اليوم.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            return (
              <FadeIn key={index} direction="up" delay={index * 0.15} duration={0.6}>
                <HoverCard
                  className={`relative flex flex-col justify-between p-8 md:p-10 rounded-2xl transition-all duration-300 h-full bg-card ${
                    plan.isPopular
                      ? "border-2 border-accent shadow-sm"
                      : "border border-border shadow-none hover:border-primary/40"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-4 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold shadow-xs">
                      <Crown className="size-3.5 fill-accent-foreground" />
                      <span>الأكثر طلباً واختياراً</span>
                    </div>
                  )}

                  {/* Header */}
                  <div>
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium min-h-8">
                        {plan.description}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-1 py-4 border-y border-border">
                      <span className="text-4xl font-black text-primary">
                        {plan.price}
                      </span>
                      <span className="text-xs font-bold text-muted-foreground">ج.م</span>
                      <span className="text-muted-foreground text-xs font-medium">
                        / {plan.period}
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="py-6 space-y-3.5">
                      {plan.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-3">
                          <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary border border-border">
                            <Check className="size-3 stroke-[3]" />
                          </div>
                          <span className="text-foreground text-xs font-semibold">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4 mt-auto">
                    <Button
                      asChild
                      variant={plan.buttonVariant}
                      size="brandLg"
                      className="w-full font-bold shadow-none text-xs"
                    >
                      <Link href={plan.href}>{plan.buttonText}</Link>
                    </Button>
                  </div>
                </HoverCard>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
