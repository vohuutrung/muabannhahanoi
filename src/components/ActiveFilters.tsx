import { X } from "lucide-react";
import { FilterState } from "@/types/property";

interface ActiveFiltersProps {
  labels: { key: keyof FilterState; label: string }[];
  onClear: (key: keyof FilterState) => void;
  onReset: () => void;
}

export function ActiveFilters({ labels, onClear, onReset }: ActiveFiltersProps) {
  if (labels.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Đang lọc:</span>
      {labels.map(({ key, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium animate-scale-in"
        >
          {label}
          <button
            onClick={() => onClear(key)}
            className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
            aria-label={`Xóa bộ lọc ${label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <button
        onClick={onReset}
        className="text-primary text-sm font-medium hover:underline ml-2"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
