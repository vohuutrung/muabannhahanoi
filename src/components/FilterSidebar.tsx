import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const priceRanges = [
  "Tất cả mức giá",
  "Dưới 500 triệu",
  "500 - 800 triệu",
  "800 triệu - 1 tỷ",
  "1 - 2 tỷ",
  "2 - 3 tỷ",
  "3 - 5 tỷ",
  "5 - 7 tỷ",
  "7 - 10 tỷ",
  "Trên 10 tỷ",
];

const areaRanges = [
  "Tất cả diện tích",
  "Dưới 30 m²",
  "30 - 50 m²",
  "50 - 80 m²",
  "80 - 100 m²",
  "100 - 150 m²",
  "150 - 200 m²",
  "Trên 200 m²",
];

const propertyTypes = [
  "Tất cả loại",
  "Nhà riêng",
  "Căn hộ chung cư",
  "Nhà mặt phố",
  "Biệt thự",
  "Đất nền",
  "Shophouse",
];

const directions = ["Đông", "Tây", "Nam", "Bắc", "Đông Bắc", "Đông Nam", "Tây Bắc", "Tây Nam"];

const legalStatuses = ["Sổ đỏ/Sổ hồng", "Hợp đồng mua bán", "Đang chờ sổ"];

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="font-semibold text-sm">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function FilterSidebar() {
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedArea, setSelectedArea] = useState(0);
  const [selectedType, setSelectedType] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedDirections, setSelectedDirections] = useState<string[]>([]);
  const [selectedLegal, setSelectedLegal] = useState<string[]>([]);

  const toggleDirection = (dir: string) => {
    setSelectedDirections((prev) =>
      prev.includes(dir) ? prev.filter((d) => d !== dir) : [...prev, dir]
    );
  };

  const toggleLegal = (status: string) => {
    setSelectedLegal((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const handleReset = () => {
    setSelectedPrice(0);
    setSelectedArea(0);
    setSelectedType(0);
    setSelectedBedrooms(null);
    setSelectedDirections([]);
    setSelectedLegal([]);
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow-card sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base">Bộ lọc tìm kiếm</h2>
        <button onClick={handleReset} className="text-primary text-sm font-medium hover:underline">
          Đặt lại
        </button>
      </div>

      <div className="space-y-4">
        {/* Property Type */}
        <FilterSection title="Loại bất động sản">
          <div className="space-y-2">
            {propertyTypes.map((type, index) => (
              <label
                key={type}
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedType === index ? "border-primary" : "border-border"
                  )}
                >
                  {selectedType === index && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Khoảng giá">
          <div className="space-y-2">
            {priceRanges.map((range, index) => (
              <label
                key={range}
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedPrice === index ? "border-primary" : "border-border"
                  )}
                >
                  {selectedPrice === index && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm">{range}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Area Range */}
        <FilterSection title="Diện tích">
          <div className="space-y-2">
            {areaRanges.map((range, index) => (
              <label
                key={range}
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedArea === index ? "border-primary" : "border-border"
                  )}
                >
                  {selectedArea === index && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm">{range}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Bedrooms */}
        <FilterSection title="Số phòng ngủ">
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setSelectedBedrooms(num === selectedBedrooms ? null : num)}
                className={cn(
                  "w-10 h-10 rounded-lg border text-sm font-medium transition-colors",
                  selectedBedrooms === num
                    ? "border-primary bg-accent text-primary"
                    : "border-border hover:border-primary"
                )}
              >
                {num === 5 ? "5+" : num}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Direction */}
        <FilterSection title="Hướng nhà">
          <div className="flex flex-wrap gap-2">
            {directions.map((dir) => (
              <button
                key={dir}
                onClick={() => toggleDirection(dir)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
                  selectedDirections.includes(dir)
                    ? "border-primary bg-accent text-primary"
                    : "border-border hover:border-primary"
                )}
              >
                {dir}
              </button>
            ))}
          </div>
        </FilterSection>

        {/* Legal Status */}
        <FilterSection title="Pháp lý">
          <div className="space-y-2">
            {legalStatuses.map((status) => (
              <label
                key={status}
                className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                    selectedLegal.includes(status) ? "border-primary bg-primary" : "border-border"
                  )}
                >
                  {selectedLegal.includes(status) && (
                    <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-sm">{status}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>

      <Button className="w-full mt-6">Áp dụng bộ lọc</Button>
    </div>
  );
}
