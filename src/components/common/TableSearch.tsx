import { Search, X } from "lucide-react";

interface TableSearchProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export function TableSearch({
  placeholder = "ابحث هنا...",
  value,
  onChange,
}: TableSearchProps) {
  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="size-4 text-muted-foreground" />
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary shadow-none"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="مسح نص البحث"
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
