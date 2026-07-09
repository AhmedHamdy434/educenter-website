"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";

import { FormInput } from "@/components/common/form-input";
import { FormSelect, type SelectOption } from "@/components/common/form-select";
import { FormActions } from "@/components/common/FormActions";
import { groupSchema, type GroupFormValues } from "../schemas/group-schema";
import { type Group, type DayOfWeek } from "../types";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../hooks/mutations";
import { getSubjectsOptions } from "@/features/subjects/actions/subjects-actions";
import {
  DAY_NAMES_AR,
  formatTime,
  DAYS_OPTIONS,
  HOUR_OPTIONS,
  MINUTE_OPTIONS,
  PERIOD_OPTIONS,
} from "@/utils/time";

interface GroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  group?: Group | null;
  gradesOptions: SelectOption[];
  teachersOptions: SelectOption[];
}

export function GroupForm({
  isOpen,
  onClose,
  group,
  gradesOptions,
  teachersOptions,
}: GroupFormProps) {
  const [subjectsOptions, setSubjectsOptions] = useState<SelectOption[]>([]);
  const [isSubjectsLoading, setIsSubjectsLoading] = useState(false);

  // Time picker temporary state
  const [tempDay, setTempDay] = useState<string>("SATURDAY");
  const [tempHour, setTempHour] = useState<string>("4");
  const [tempMinute, setTempMinute] = useState<string>("30");
  const [tempPeriod, setTempPeriod] = useState<string>("PM");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      gradeId: "",
      subjectId: "",
      teacherId: "",
      capacity: null,
      schedule: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule",
  });

  const { mutateAsync: createGroup, isPending: isCreatePending } =
    useCreateGroupMutation();
  const { mutateAsync: updateGroup, isPending: isUpdatePending } =
    useUpdateGroupMutation();

  const selectedGradeId = watch("gradeId");

  // Fetch subjects options dynamically when selected grade changes
  useEffect(() => {
    if (selectedGradeId) {
      setIsSubjectsLoading(true);
      getSubjectsOptions(selectedGradeId)
        .then((res) => {
          if (res.success) {
            const mapped = (res.data || []).map((s) => ({
              value: s.id,
              label: `${s.name} (${s.grade.name})`,
            }));
            setSubjectsOptions(mapped);
          }
        })
        .finally(() => {
          setIsSubjectsLoading(false);
        });
    } else {
      setSubjectsOptions([]);
    }
  }, [selectedGradeId]);

  // Populate form values if editing
  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        gradeId: group.gradeId,
        subjectId: group.subjectId,
        teacherId: group.teacherId,
        capacity: group.capacity,
        schedule: group.schedule.map((item) => ({
          day: item.day,
          hour: item.hour,
          minute: item.minute,
        })),
      });
    } else {
      reset({
        name: "",
        gradeId: "",
        subjectId: "",
        teacherId: "",
        capacity: null,
        schedule: [],
      });
    }
  }, [group, reset, isOpen]);

  const handleFormSubmit = async (values: GroupFormValues) => {
    if (!!group) {
      await updateGroup(
        { id: group.id, values },
        {
          onSuccess: (res) => {
            if (res.success) {
              onClose();
            }
          },
        }
      );
    } else {
      await createGroup(values, {
        onSuccess: (res) => {
          if (res.success) {
            onClose();
          }
        },
      });
    }
  };

  const handleAddScheduleItem = () => {
    let hour24 = parseInt(tempHour);
    const minuteVal = parseInt(tempMinute);

    if (tempPeriod === "PM" && hour24 < 12) {
      hour24 += 12;
    } else if (tempPeriod === "AM" && hour24 === 12) {
      hour24 = 0;
    }

    // Check if duplicate schedule exists
    const hasDuplicate = fields.some(
      (item) =>
        item.day === tempDay && item.hour === hour24 && item.minute === minuteVal
    );

    if (!hasDuplicate) {
      append({
        day: tempDay as DayOfWeek,
        hour: hour24,
        minute: minuteVal,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 text-right"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="اسم المجموعة الدراسية"
          id="name"
          placeholder="مثال: مجموعة أ - الصف الأول الثانوي"
          error={errors.name?.message}
          {...register("name")}
        />

        <FormInput
          label="السعة الاستيعابية للطلاب (اختياري)"
          id="capacity"
          type="number"
          placeholder="اتركه فارغاً لسعة غير محدودة"
          error={errors.capacity?.message}
          {...register("capacity", {
            valueAsNumber: true,
            setValueAs: (val) => (val === "" || isNaN(Number(val)) ? null : Number(val)),
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormSelect
          label="المرحلة الدراسية"
          name="gradeId"
          control={control}
          options={gradesOptions}
          placeholder="اختر المرحلة..."
          error={errors.gradeId?.message}
        />

        <FormSelect
          label="المادة الدراسية"
          name="subjectId"
          control={control}
          options={subjectsOptions}
          placeholder={
            isSubjectsLoading
              ? "جاري التحميل..."
              : selectedGradeId
              ? "اختر المادة..."
              : "اختر المرحلة أولاً"
          }
          error={errors.subjectId?.message}
        />

        <FormSelect
          label="المعلم المسؤول"
          name="teacherId"
          control={control}
          options={teachersOptions}
          placeholder="اختر المعلم..."
          error={errors.teacherId?.message}
        />
      </div>

      {/* Schedule Picker Section */}
      <div className="border border-slate-200 rounded-xl p-4 space-y-4 bg-slate-50/30">
        <h3 className="text-sm font-semibold text-slate-800">
          جدول المواعيد الأسبوعية للمجموعة
        </h3>

        {/* Temporary inputs to build a schedule item */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">اليوم</span>
            <select
              value={tempDay}
              onChange={(e) => setTempDay(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none text-slate-700 focus:border-[#1E4632]"
            >
              {DAYS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">الساعة</span>
            <select
              value={tempHour}
              onChange={(e) => setTempHour(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none text-slate-700 focus:border-[#1E4632]"
            >
              {HOUR_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-medium block">الدقيقة</span>
            <select
              value={tempMinute}
              onChange={(e) => setTempMinute(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none text-slate-700 focus:border-[#1E4632]"
            >
              {MINUTE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 items-center">
            <div className="space-y-1 flex-1">
              <span className="text-xs text-slate-500 font-medium block">الفترة</span>
              <select
                value={tempPeriod}
                onChange={(e) => setTempPeriod(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none text-slate-700 focus:border-[#1E4632]"
              >
                {PERIOD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddScheduleItem}
              className="h-10 px-3 rounded-lg bg-[#1E4632] hover:bg-[#1E4632]/90 text-white flex items-center justify-center transition-colors shrink-0"
              title="إضافة موعد"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>

        {/* Selected schedule list */}
        {fields.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            {fields.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
              >
                <span>
                  {DAY_NAMES_AR[item.day]} {formatTime(item.hour, item.minute)}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition-colors"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-2">
            لم يتم تحديد أي مواعيد بعد. يرجى إضافة موعد واحد على الأقل.
          </div>
        )}

        {errors.schedule && (
          <p className="text-xs text-red-500 font-semibold pt-1">
            {errors.schedule.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <FormActions
        onCancel={onClose}
        isSubmitting={isCreatePending || isUpdatePending}
        submitLabel={group ? "حفظ التغييرات" : "إضافة المجموعة"}
      />
    </form>
  );
}
