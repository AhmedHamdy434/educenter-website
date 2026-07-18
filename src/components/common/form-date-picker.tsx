"use client";

import * as React from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type FormDatePickerProps<TFieldValues extends FieldValues = FieldValues> = {
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
} & (
  | {
      name: Path<TFieldValues>;
      control: Control<TFieldValues>;
      value?: never;
      onChange?: never;
    }
  | {
      name?: never;
      control?: never;
      value: string;
      onChange: (value: string) => void;
    }
);

export function FormDatePicker<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  placeholder = "اختر تاريخاً...",
  error,
  className,
  required = false,
  value,
  onChange,
}: FormDatePickerProps<TFieldValues>) {
  const renderDatePicker = (currentValue: string, handleChange: (val: string) => void) => {
    const selectedDate = currentValue ? new Date(currentValue) : undefined;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full h-11 px-4 py-3 rounded-xl border bg-white text-slate-800 text-sm font-medium outline-none transition-all text-right flex items-center justify-between shadow-none",
              error
                ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/5"
                : "border-slate-200 focus:border-[#1e4632] focus:ring-1 focus:ring-[#1e4632]/5",
              !currentValue && "text-slate-400",
              className
            )}
          >
            <span>
              {currentValue
                ? format(selectedDate!, "PPP", { locale: ar })
                : placeholder}
            </span>
            <CalendarIcon className="size-4 text-slate-400 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                handleChange(`${yyyy}-${mm}-${dd}`);
              } else {
                handleChange("");
              }
            }}
            locale={ar}
          />
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <div className="space-y-2 w-full text-right" dir="rtl">
      {label && (
        <Label className="text-xs font-semibold text-slate-600 block text-right select-none">
          {label}
          {required && <span className="text-red-500 mr-1 select-none">*</span>}
        </Label>
      )}
      {control && name ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => renderDatePicker(field.value, field.onChange)}
        />
      ) : (
        renderDatePicker(value || "", onChange!)
      )}
      {error && (
        <p className="text-xs text-red-500 font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
