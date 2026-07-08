"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useDebounce } from "@/hooks/useDebounce";

interface FilterOption {
  label: string;
  value: string ;
}

interface FilterSelect {
  key: string;
  placeholder: string;
  options: FilterOption[];
}

interface TableFiltersProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: FilterSelect[];
  filterValues?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
}

export function TableFilters({
  searchPlaceholder = "البحث...",
  searchValue,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
}: TableFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const debouncedSearch = useDebounce(localSearch, 400);

  // Sync local search state with props
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Debounced search trigger
  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div
      className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4 text-right"
      dir="rtl"
    >
      {/* Search Input */}
      <div className="relative flex-1 max-w-md w-full">
        <label htmlFor="table-search" className="sr-only">
          {searchPlaceholder}
        </label>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <Search className="size-4 text-slate-400" />
        </div>
        <Input
          id="table-search"
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={searchPlaceholder}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white pr-10 pl-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#1E4632] focus:border-[#1E4632] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#1E4632]"
        />
      </div>

      {/* Select Filters */}
      {filters.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {filters.map((filter) => (
            <div key={filter.key} className="w-full sm:w-40">
              <Select
                value={filterValues[filter.key] || "all"}
                onValueChange={(val) => {
                  if (onFilterChange) {
                    onFilterChange(filter.key, val === "all" ? "" : val);
                  }
                }}
              >
                <SelectTrigger className="h-10 w-full border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:ring-1 focus:ring-[#1E4632] focus:border-[#1E4632] focus-visible:outline-none">
                  <SelectValue placeholder={filter.placeholder} />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="bg-white border border-slate-100 rounded-xl shadow-lg"
                >
                  <SelectItem
                    value="all"
                    className="focus:bg-slate-50 focus:text-slate-900 cursor-pointer"
                  >
                    الكل
                  </SelectItem>
                  {filter.options.map((opt) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
