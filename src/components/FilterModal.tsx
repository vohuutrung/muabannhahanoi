import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  FilterState, 
  PROPERTY_TYPES, 
  PRICE_RANGES, 
  AREA_RANGES, 
  DIRECTIONS, 
  LEGAL_STATUSES, 
  INTERIOR_OPTIONS,
  HANOI_DISTRICTS 
} from "@/types/property";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggleArrayFilter: <K extends keyof FilterState>(key: K, value: string) => void;
  onReset: () => void;
  resultCount: number;
}

export function FilterModal({ 
  isOpen, 
  onClose, 
  filters, 
  onUpdateFilter, 
  onToggleArrayFilter, 
  onReset,
  resultCount 
}: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-4 py-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-lg">Bộ lọc</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 space-y-6">
          {/* Property Type */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Loại bất động sản</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => onUpdateFilter("propertyType", type.value as FilterState["propertyType"])}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.propertyType === type.value
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* District */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Quận/Huyện</h3>
            <div className="flex flex-wrap gap-2">
              {HANOI_DISTRICTS.map((district) => (
                <button
                  key={district.value}
                  onClick={() => onUpdateFilter("district", district.value as FilterState["district"])}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.district === district.value
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {district.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Khoảng giá</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      filters.priceRange === range.value ? "border-primary" : "border-border"
                    )}
                  >
                    {filters.priceRange === range.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm" onClick={() => onUpdateFilter("priceRange", range.value as FilterState["priceRange"])}>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Area Range */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Diện tích</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {AREA_RANGES.map((range) => (
                <label
                  key={range.value}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      filters.areaRange === range.value ? "border-primary" : "border-border"
                    )}
                  >
                    {filters.areaRange === range.value && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm" onClick={() => onUpdateFilter("areaRange", range.value as FilterState["areaRange"])}>{range.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Số phòng ngủ</h3>
            <div className="flex flex-wrap gap-2">
              {[null, 1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num ?? "all"}
                  onClick={() => onUpdateFilter("bedrooms", num)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.bedrooms === num
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {num === null ? "Tất cả" : num === 5 ? "5+" : num}
                </button>
              ))}
            </div>
          </div>

          {/* Floors */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Số tầng</h3>
            <div className="flex flex-wrap gap-2">
              {[null, 1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num ?? "all"}
                  onClick={() => onUpdateFilter("floors", num)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.floors === num
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {num === null ? "Tất cả" : num === 6 ? "6+" : num}
                </button>
              ))}
            </div>
          </div>

          {/* House Direction */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Hướng nhà</h3>
            <div className="flex flex-wrap gap-2">
              {DIRECTIONS.map((dir) => (
                <button
                  key={dir}
                  onClick={() => onToggleArrayFilter("direction", dir)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.direction.includes(dir)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Balcony Direction */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Hướng ban công</h3>
            <div className="flex flex-wrap gap-2">
              {DIRECTIONS.map((dir) => (
                <button
                  key={dir}
                  onClick={() => onToggleArrayFilter("balconyDirection", dir)}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.balconyDirection.includes(dir)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {dir}
                </button>
              ))}
            </div>
          </div>

          {/* Legal Status */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Pháp lý</h3>
            <div className="flex flex-wrap gap-2">
              {LEGAL_STATUSES.map((status) => (
                <button
                  key={status}
                  onClick={() => onToggleArrayFilter("legalStatus", status)}
                  className={cn(
                    "px-3 py-2 rounded-full border text-sm font-medium transition-colors",
                    filters.legalStatus.includes(status)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Interior */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Nội thất</h3>
            <div className="flex flex-wrap gap-2">
              {INTERIOR_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => onToggleArrayFilter("interior", option)}
                  className={cn(
                    "px-3 py-2 rounded-full border text-sm font-medium transition-colors",
                    filters.interior.includes(option)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Loại tin</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "Tất cả" },
                { value: "hot", label: "Tin HOT" },
                { value: "vip", label: "Tin VIP" },
                { value: "normal", label: "Tin thường" },
              ].map((priority) => (
                <button
                  key={priority.value}
                  onClick={() => onUpdateFilter("priority", priority.value as FilterState["priority"])}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
                    filters.priority === priority.value
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onReset}>
            Đặt lại
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Xem {resultCount} kết quả
          </Button>
        </div>
      </div>
    </div>
  );
}
