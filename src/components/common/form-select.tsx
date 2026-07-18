import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

export type FormSelectProps<TFieldValues extends FieldValues = FieldValues> = {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
} & (
  | {
      name: Path<TFieldValues>;
      control: Control<TFieldValues>;
      value?: never;
      onValueChange?: never;
    }
  | {
      name?: never;
      control?: never;
      value: string;
      onValueChange: (value: string) => void;
    }
);

export function FormSelect<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  options,
  label,
  placeholder,
  error,
  className,
  value,
  onValueChange,
}: FormSelectProps<TFieldValues>) {
  const triggerButton = (
    <SelectTrigger
      aria-invalid={!!error}
      className={cn(
        "w-full! h-11! px-4 py-3 rounded-xl! border bg-white text-slate-800 text-sm font-medium outline-none transition-all text-right flex items-center justify-between",
        error
          ? "border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/5"
          : "border-slate-200 focus-visible:border-[#1e4632] focus-visible:ring-[#1e4632]/5",
        className
      )}
    >
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
  );

  const selectContent = (
    <SelectContent
      position="popper"
      className="bg-white border border-slate-200/80 rounded-xl shadow-xl z-50 w-(--radix-select-trigger-width) max-h-60 overflow-y-auto"
    >
      {options.map((option) => (
        <SelectItem
          key={option.value}
          value={option.value}
        >
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  );

  return (
    <div className="space-y-2 w-full text-right" dir="rtl">
      {label && (
        <Label className="text-xs font-semibold text-slate-600 block text-right">
          {label}
        </Label>
      )}
      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} dir="rtl">
              {triggerButton}
              {selectContent}
            </Select>
          )}
        />
      ) : (
        <Select onValueChange={onValueChange} value={value} dir="rtl">
          {triggerButton}
          {selectContent}
        </Select>
      )}
      {error && (
        <p className="text-xs text-red-500 font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
