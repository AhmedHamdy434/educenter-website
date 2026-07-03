import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverCard,
} from "@/components/common/motion-wrapper";
import { getSubscriptionPlans } from "@/features/landing/api/get-subscription-plans";
import { cn } from "@/lib/utils";

export async function Pricing() {
  const data = await getSubscriptionPlans();
  const plans = data.data || [];

  return (
    <section id="pricing" className="w-full py-20">
      <div className="container">
        {/* Section Header */}
        <FadeIn
          direction="up"
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#E5A93B] text-sm font-semibold">
            <Crown className="size-3.5 fill-[#E5A93B]" />
            اختر الباقة المناسبة لمركزك
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E4632] tracking-tight">
            باقات مرنة تناسب احتياجاتك
          </h2>
          <p className="text-slate-500 text-base leading-relaxed">
            جميع الباقات تشمل تحديثات مستمرة ودعم فني مميز
          </p>
        </FadeIn>

        {/* Pricing Grid */}
        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {plans.map((plan, idx) => {
            const features = [
              plan.studentLimit === -1 || plan.studentLimit >= 999999
                ? "طلاب غير محدودين"
                : `عدد الطلاب الأقصى: ${plan.studentLimit}`,
              plan.teacherLimit === -1 || plan.teacherLimit >= 999999
                ? "مدرسين غير محدودين"
                : `عدد المدرسين الأقصى: ${plan.teacherLimit}`,
              plan.subjectLimit === -1 || plan.subjectLimit >= 999999
                ? "مواد غير محدودة"
                : `عدد المواد الأقصى: ${plan.subjectLimit}`,
              plan.canCreateExams ? "إمكانية إنشاء الاختبارات والواجبات" : null,
              plan.canExportReports ? "تصدير التقارير والتحليلات" : null,
              plan.canUploadFiles ? "رفع الملفات والمرفقات" : null,
            ].filter((f): f is string => f !== null);

            return (
              <StaggerItem key={idx} direction="up" className="h-full">
                <HoverCard
                  yOffset={plan.isPopular ? -8 : -5}
                  className={cn(
                    `relative flex flex-col justify-between h-full bg-white border rounded-3xl p-8 transition-all duration-300 ${
                      plan.isPopular
                        ? "border-[#E5A93B] border-2 shadow-lg shadow-[#E5A93B]/5"
                        : "border-slate-100 shadow-xs hover:border-slate-200/80 hover:shadow-md"
                    }`,
                  )}
                >
                  {/* Highlight Badge */}
                  {plan.isPopular && (
                    <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#E5A93B] text-white text-xs font-bold shadow-sm">
                      <Crown className="size-3 fill-white" />
                      <span>الأكثر شعبية</span>
                    </div>
                  )}

                  {/* Card Top */}
                  <div className="space-y-6">
                    {/* Title & Subtitle */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#1E4632] mb-1">
                        {plan.name}
                      </h3>
                      {plan.description && (
                        <span className="text-xs text-slate-400 font-medium">
                          {plan.description}
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-center gap-1 py-4 border-y border-slate-100">
                      <span className="text-4xl font-black text-[#1E4632]">
                        {plan.price}
                      </span>
                      <span className="text-slate-500 text-sm font-semibold">
                        ج.م / شهر
                      </span>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-4">
                      {features.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3">
                          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0F7F4] text-[#1E4632]">
                            <Check className="size-3 stroke-3" />
                          </div>
                          <span className="text-slate-600 text-sm font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Card Button */}
                  <div className="pt-8 mt-auto">
                    <Button
                      variant={plan.isPopular ? "brand" : "brandOutline"}
                      size="brandLg"
                      className="w-full font-semibold"
                    >
                      اختر الباقة
                    </Button>
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
