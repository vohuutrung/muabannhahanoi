import { cn } from "@/lib/utils";
import { 
  PROPERTY_TYPES, 
  PRICE_RANGES, 
  AREA_RANGES, 
  HANOI_DISTRICTS,
  DIRECTIONS,
  LEGAL_STATUSES,
  INTERIOR_OPTIONS,
  FilterState 
} from "@/types/property";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface FilterTabsProps {
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggleArrayFilter: <K extends keyof FilterState>(key: K, value: string) => void;
}

interface DropdownProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  isActive?: boolean;
}

function FilterDropdown({ label, value, options, onChange, isActive }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
          isActive
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card border-border hover:border-primary hover:text-primary"
        )}
      >
        <span className="truncate max-w-[120px]">{selectedLabel}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-card rounded-lg shadow-lg border border-border py-2 min-w-[200px] max-h-[300px] overflow-y-auto z-50 animate-fade-in">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                value === option.value && "text-primary font-medium bg-accent"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface MultiSelectDropdownProps {
  label: string;
  selected: string[];
  options: string[];
  onToggle: (value: string) => void;
}

function MultiSelectDropdown({ label, selected, options, onToggle }: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayLabel = selected.length > 0 ? `${label} (${selected.length})` : label;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
          selected.length > 0
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-card border-border hover:border-primary hover:text-primary"
        )}
      >
        <span className="truncate max-w-[120px]">{displayLabel}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform shrink-0", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-card rounded-lg shadow-lg border border-border py-2 min-w-[200px] max-h-[300px] overflow-y-auto z-50 animate-fade-in">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onToggle(option)}
              className={cn(
                "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-3",
                selected.includes(option) && "text-primary font-medium"
              )}
            >
              <div
                className={cn(
                  "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                  selected.includes(option) ? "border-primary bg-primary" : "border-border"
                )}
              >
                {selected.includes(option) && (
                  <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface NumberSelectProps {
  label: string;
  value: number | null;
  options: number[];
  onChange: (value: number | null) => void;
}

function NumberSelect({ label, value, options, onChange }: NumberSelectProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">{label}:</span>
      <div className="flex gap-1">
        {options.map((num) => (
          <button
            key={num}
            onClick={() => onChange(num === value ? null : num)}
            className={cn(
              "w-8 h-8 rounded-lg border text-sm font-medium transition-all",
              value === num
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary hover:text-primary"
            )}
          >
            {num === options[options.length - 1] ? `${num}+` : num}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterTabs({ filters, onUpdateFilter, onToggleArrayFilter }: FilterTabsProps) {
  return (
    <div className="space-y-4">
      {/* Row 1: Main filters */}
      <div className="flex flex-wrap gap-2">
        <FilterDropdown
          label="Loại BĐS"
          value={filters.propertyType}
          options={PROPERTY_TYPES}
          onChange={(v) => onUpdateFilter("propertyType", v)}
          isActive={filters.propertyType !== "all"}
        />
        <FilterDropdown
          label="Khoảng giá"
          value={filters.priceRange}
          options={PRICE_RANGES}
          onChange={(v) => onUpdateFilter("priceRange", v)}
          isActive={filters.priceRange !== "all"}
        />
        <FilterDropdown
          label="Diện tích"
          value={filters.areaRange}
          options={AREA_RANGES}
          onChange={(v) => onUpdateFilter("areaRange", v)}
          isActive={filters.areaRange !== "all"}
        />
        <FilterDropdown
          label="Quận/Huyện"
          value={filters.district}
          options={HANOI_DISTRICTS}
          onChange={(v) => onUpdateFilter("district", v)}
          isActive={filters.district !== "all"}
        />
      </div>

      {/* Row 2: Additional filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <NumberSelect
          label="Phòng ngủ"
          value={filters.bedrooms}
          options={[1, 2, 3, 4, 5]}
          onChange={(v) => onUpdateFilter("bedrooms", v)}
        />
        <NumberSelect
          label="Số tầng"
          value={filters.floors}
          options={[1, 2, 3, 4, 5]}
          onChange={(v) => onUpdateFilter("floors", v)}
        />
        <MultiSelectDropdown
          label="Hướng nhà"
          selected={filters.direction}
          options={DIRECTIONS}
          onToggle={(v) => onToggleArrayFilter("direction", v)}
        />
        <MultiSelectDropdown
          label="Pháp lý"
          selected={filters.legalStatus}
          options={LEGAL_STATUSES}
          onToggle={(v) => onToggleArrayFilter("legalStatus", v)}
        />
        <MultiSelectDropdown
          label="Nội thất"
          selected={filters.interior}
          options={INTERIOR_OPTIONS}
          onToggle={(v) => onToggleArrayFilter("interior", v)}
        />
        <FilterDropdown
          label="Ưu tiên tin"
          value={filters.priority}
          options={[
            { value: "all", label: "Tất cả" },
            { value: "hot", label: "Tin HOT" },
            { value: "vip", label: "Tin VIP" },
            { value: "normal", label: "Tin thường" },
          ]}
          onChange={(v) => onUpdateFilter("priority", v as FilterState["priority"])}
          isActive={filters.priority !== "all"}
        />
      </div>
    </div>
  );
}
