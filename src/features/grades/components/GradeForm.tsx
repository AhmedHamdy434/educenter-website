"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import { gradeSchema, type GradeFormValues } from "../schemas/grade-schema";
import { type Grade } from "../types";

interface GradeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: GradeFormValues) => Promise<void>;
  grade?: Grade | null;
  isSubmitting: boolean;
}

export function GradeForm({
  isOpen,
  onClose,
  onSubmit,
  grade,
  isSubmitting,
}: GradeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GradeFormValues>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      name: "",
      description: "",
      order: 1,
    },
  });

  // Populate form values if editing
  useEffect(() => {
    if (grade) {
      reset({
        name: grade.name,
        description: grade.description || "",
        order: grade.order,
      });
    } else {
      reset({
        name: "",
        description: "",
        order: 1,
      });
    }
  }, [grade, reset, isOpen]);


  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-right">
        <FormInput
          label="اسم المرحلة الدراسية"
          id="grade-name"
          placeholder="مثال: الصف الأول الثانوي"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormTextarea
          label="شرح أو وصف المرحلة (اختياري)"
          id="grade-description"
          placeholder="مثال: شرح وتدريبات لطلاب الصف الأول الثانوي"
          error={errors.description?.message}
          {...register("description")}
        />

        <FormInput
          label="ترتيب العرض في القائمة"
          id="grade-order"
          type="number"
          placeholder="مثال: 1"
          error={errors.order?.message}
          {...register("order", { valueAsNumber: true })}
        />

        {/* Action Buttons */}
        <FormActions
          onCancel={onClose}
          isSubmitting={isSubmitting}
          submitLabel={grade ? "حفظ التغييرات" : "إضافة المرحلة"}
        />
      </form>
  );
}
