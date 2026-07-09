"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ChevronDown, Check, X, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormMultiSelectProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export function FormMultiSelect<TFieldValues extends FieldValues>({
  name,
  control,
  options,
  label,
  placeholder = "اختر...",
  error,
  className,
}: FormMultiSelectProps<TFieldValues>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-2 w-full text-right" dir="rtl" ref={containerRef}>
      {label && (
        <Label className="text-xs font-semibold text-slate-600 block text-right">
          {label}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedValues: string[] = Array.isArray(field.value)
            ? field.value
            : [];

          const handleToggleOption = (value: string) => {
            let newValue: string[];
            if (selectedValues.includes(value)) {
              newValue = selectedValues.filter((v) => v !== value);
            } else {
              newValue = [...selectedValues, value];
            }
            field.onChange(newValue);
          };

          const handleRemoveOption = (value: string) => {
            const newValue = selectedValues.filter((v) => v !== value);
            field.onChange(newValue);
          };

          // Find full option objects for selected values
          const selectedOptions = options.filter((opt) =>
            selectedValues.includes(opt.value)
          );

          return (
            <div className="relative">
              {/* Trigger Button */}
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => {
                  setIsOpen((prev) => {
                    const next = !prev;
                    if (!next) setSearchQuery("");
                    return next;
                  });
                }}
                className={cn(
                  "w-full h-11 px-4 py-3 rounded-xl border bg-white text-slate-800 text-sm font-medium outline-none transition-all text-right flex items-center justify-between focus:ring-1 focus:ring-[#1E4632]/20 focus:border-[#1E4632]",
                  error
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/5"
                    : "border-slate-200 focus:border-[#1E4632]",
                  className
                )}
              >
                <span className={cn(selectedValues.length === 0 && "text-slate-400 font-normal")}>
                  {selectedValues.length > 0
                    ? `تم اختيار ${selectedValues.length} من المواد`
                    : placeholder}
                </span>
                <ChevronDown className={cn("size-4 text-slate-400 transition-transform duration-200", isOpen && "rotate-180")} />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 left-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 max-h-64 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  {/* Search Input */}
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50/50">
                    <Search className="size-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="ابحث عن مادة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  {/* Options List */}
                  <div className="overflow-y-auto flex-1 py-1 max-h-48">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => handleToggleOption(option.value)}
                            className="w-full px-4 py-2 text-right text-sm hover:bg-slate-50 transition-colors flex items-center justify-between text-slate-700 hover:text-slate-950"
                          >
                            <span>{option.label}</span>
                            {isSelected && (
                              <Check className="size-4 text-[#1E4632] shrink-0" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-3 text-right text-sm text-slate-400">
                        لا توجد نتائج مطابقة.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Options Tags */}
              {selectedOptions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 bg-slate-50/40 p-2 border border-dashed border-slate-200 rounded-xl">
                  {selectedOptions.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center gap-1.5 bg-[#1E4632]/5 text-[#1E4632] border border-[#1E4632]/10 px-2.5 py-1 rounded-lg text-xs font-semibold select-none animate-in zoom-in-95 duration-100"
                    >
                      <span>{option.label}</span>
                      <button
                        type="button"
                        aria-label={`إزالة ${option.label}`}
                        onClick={() => handleRemoveOption(option.value)}
                        className="hover:bg-[#1E4632]/10 rounded p-0.5 transition-colors text-[#1E4632]"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }}
      />

      {error && (
        <p className="text-xs text-red-500 font-semibold text-right">{error}</p>
      )}
    </div>
  );
}
