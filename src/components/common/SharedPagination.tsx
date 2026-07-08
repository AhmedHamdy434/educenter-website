"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SharedPaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function SharedPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
}: SharedPaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-2 text-slate-500 text-sm w-full" dir="rtl">
      {/* Limit select & Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>عرض</span>
          <Select
            value={limit.toString()}
            onValueChange={(val) => {
              onLimitChange(Number(val));
            }}
          >
            <SelectTrigger className="h-9 w-20 border border-slate-200 rounded-lg text-slate-700 bg-white focus:ring-1 focus:ring-[#1E4632] focus:border-[#1E4632] focus-visible:outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-slate-100 rounded-xl shadow-lg">
              {[5, 10, 20, 50].map((size) => (
                <SelectItem key={size} value={size.toString()} className="cursor-pointer">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>عناصر</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <span>
          إجمالي {total} عنصر (صفحة {page} من {totalPages})
        </span>
      </div>

      {/* Navigation Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5" dir="ltr">
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-slate-200 rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            aria-label="الصفحة الأولى"
          >
            <ChevronsLeft className="size-4 text-slate-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-slate-200 rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="الصفحة السابقة"
          >
            <ChevronLeft className="size-4 text-slate-600" />
          </Button>
          
          <div className="flex items-center justify-center px-3 font-semibold text-slate-700">
            {page}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="size-9 border-slate-200 rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="الصفحة التالية"
          >
            <ChevronRight className="size-4 text-slate-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9 border-slate-200 rounded-lg bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4632] focus-visible:ring-offset-2"
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            aria-label="الصفحة الأخيرة"
          >
            <ChevronsRight className="size-4 text-slate-600" />
          </Button>
        </div>
      )}
    </div>
  );
}
