import { z } from "zod";

const scheduleItemSchema = z.object({
  day: z.enum(
    ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    { message: "يجب اختيار يوم صحيح" }
  ),
  hour: z
    .number({ message: "الساعة مطلوبة" })
    .min(0, { message: "الساعة غير صحيحة" })
    .max(23, { message: "الساعة غير صحيحة" }),
  minute: z
    .number({ message: "الدقيقة مطلوبة" })
    .min(0, { message: "الدقيقة غير صحيحة" })
    .max(59, { message: "الدقيقة غير صحيحة" }),
});

export const groupSchema = z.object({
  name: z
    .string()
    .min(1, { message: "اسم المجموعة مطلوب" })
    .max(100, { message: "الاسم لا يمكن أن يتجاوز 100 حرف" }),
  gradeId: z
    .string()
    .min(1, { message: "المرحلة الدراسية مطلوبة" }),
  subjectId: z
    .string()
    .min(1, { message: "المادة الدراسية مطلوبة" }),
  teacherId: z
    .string()
    .min(1, { message: "المعلم مطلوب" }),
  capacity: z
    .number()
    .min(1, { message: "السعة يجب أن تكون 1 على الأقل" })
    .optional()
    .nullable()
    .or(z.nan().transform(() => null)), // Handle empty numbers
  schedule: z
    .array(scheduleItemSchema)
    .min(1, { message: "يجب إضافة موعد أسبوعي واحد على الأقل" }),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
