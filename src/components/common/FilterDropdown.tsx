"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  allOptionLabel?: string;
  className?: string;
}

export function FilterDropdown({
  placeholder,
  value,
  onChange,
  options,
  allOptionLabel = "الكل",
  className = "",
}: FilterDropdownProps) {
  return (
    <div className={`w-full sm:w-40 ${className}`} dir="rtl">
      <Select
        value={value || "all"}
        onValueChange={(val) => {
          onChange(val === "all" ? "" : val);
        }}
        dir="rtl"
      >
        <SelectTrigger className="h-10 w-full border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:ring-1 focus:ring-[#1E4632] focus:border-[#1E4632] focus-visible:outline-none">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          align="end"
          className="bg-white border border-slate-100 rounded-xl shadow-lg"
        >
          <SelectItem
            value="all"
            className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
          >
            {allOptionLabel}
          </SelectItem>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
