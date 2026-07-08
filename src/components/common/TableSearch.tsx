"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

interface TableSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TableSearch({
  placeholder = "البحث...",
  value,
  onChange,
  className = "",
}: TableSearchProps) {
  const [localSearch, setLocalSearch] = useState(value);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Invoke parent's onChange when debounced search term changes
  useEffect(() => {
    onChange(debouncedSearch);
  }, [debouncedSearch, onChange]);

  return (
    <div className={`relative w-full max-w-md ${className}`} dir="rtl">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="size-4 text-slate-400" />
      </div>
      <Input
        type="text"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#1E4632] focus:border-[#1E4632] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E4632]"
      />
    </div>
  );
}
