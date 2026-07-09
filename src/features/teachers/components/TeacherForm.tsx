"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { FormInput } from "@/components/common/form-input";
import { FormTextarea } from "@/components/common/form-textarea";
import { FormActions } from "@/components/common/FormActions";
import { teacherSchema, type TeacherFormValues } from "../schemas/teacher-schema";
import { type Teacher } from "../types";
import {
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
} from "../hooks/mutations";

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  teacher?: Teacher | null;
  subjectsOptions: { value: string; label: string }[];
}

export function TeacherForm({ isOpen, onClose, teacher, subjectsOptions }: TeacherFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      specialization: "",
      salary: 0,
      bio: "",
      subjectIds: [],
    },
  });

  const { mutateAsync: createTeacher, isPending: isCreatePending } =
    useCreateTeacherMutation();
  const { mutateAsync: updateTeacher, isPending: isUpdatePending } =
    useUpdateTeacherMutation();

  const handleFormSubmit = async (values: TeacherFormValues) => {
    if (!!teacher) {
      await updateTeacher(
        { id: teacher.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        },
      );
    } else {
      await createTeacher(values, {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          }
        },
      });
    }
  };

  // Populate form values if editing
  useEffect(() => {
    if (teacher) {
      reset({
        fullName: teacher.user.fullName,
        email: teacher.user.email,
        password: "", // Leave blank when editing
        phone: teacher.user.phone,
        specialization: teacher.specialization,
        salary: teacher.salary,
        bio: teacher.bio || "",
        subjectIds: teacher.subjects.map((s) => s.subject.id),
      });
    } else {
      reset({
        fullName: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        salary: 0,
        bio: "",
        subjectIds: [],
      });
    }
  }, [teacher, reset, isOpen]);

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="الاسم الكامل"
          id="fullName"
          placeholder="مثال: محمد علي"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormInput
          label="البريد الإلكتروني"
          id="email"
          type="email"
          placeholder="teacher@example.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label={teacher ? "كلمة المرور الجديدة (اختياري)" : "كلمة المرور"}
          id="password"
          type="password"
          placeholder={teacher ? "اتركها فارغة للإبقاء على الحالية" : "••••••"}
          error={errors.password?.message}
          {...register("password")}
        />

        <FormInput
          label="رقم الهاتف"
          id="phone"
          placeholder="مثال: +966500000000"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="التخصص"
          id="specialization"
          placeholder="مثال: الرياضيات والفيزياء"
          error={errors.specialization?.message}
          {...register("specialization")}
        />

        <FormInput
          label="الراتب الشهري"
          id="salary"
          type="number"
          placeholder="مثال: 5000"
          error={errors.salary?.message}
          {...register("salary", { valueAsNumber: true })}
        />
      </div>

      {/* Subjects Checkbox Selection */}
      <div className="space-y-2 text-right">
        <label className="text-xs font-semibold text-slate-600 block">
          المواد الدراسية التي يدرسها
        </label>
        <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-xl p-4 max-h-48 overflow-y-auto" dir="rtl">
          {subjectsOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none"
            >
              <input
                type="checkbox"
                value={opt.value}
                className="rounded border-slate-300 text-[#1E4632] focus:ring-[#1E4632] size-4 cursor-pointer"
                {...register("subjectIds")}
              />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>
        {errors.subjectIds && (
          <p className="text-xs text-red-500 font-semibold">
            {errors.subjectIds.message}
          </p>
        )}
      </div>

      <FormTextarea
        label="نبذة تعريفية أو سيرة ذاتية (اختياري)"
        id="bio"
        placeholder="معلم خبرة 10 سنوات في تدريس الرياضيات..."
        error={errors.bio?.message}
        {...register("bio")}
      />

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={teacher ? "حفظ التغييرات" : "إضافة المدرس"}
      />
    </form>
  );
}
