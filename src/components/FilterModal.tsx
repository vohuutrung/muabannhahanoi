import { useState } from "react";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
  "10 - 20 tỷ",
  "Trên 20 tỷ",
];

const areaRanges = [
  "Tất cả diện tích",
  "Dưới 30 m²",
  "30 - 50 m²",
  "50 - 80 m²",
  "80 - 100 m²",
  "100 - 150 m²",
  "150 - 200 m²",
  "200 - 250 m²",
  "250 - 300 m²",
  "300 - 500 m²",
  "Trên 500 m²",
];

const directions = ["Bắc", "Đông Bắc", "Đông", "Đông Nam", "Nam", "Tây Nam", "Tây", "Tây Bắc"];

const legalStatuses = ["Sổ đỏ/Sổ hồng", "Hợp đồng mua bán", "Đang chờ sổ", "Khác"];

const furnitureOptions = ["Đầy đủ", "Cơ bản", "Không nội thất", "Khác"];

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [activeTab, setActiveTab] = useState<"buy" | "rent">("buy");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [selectedArea, setSelectedArea] = useState(0);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(null);
  const [selectedBalconyDirection, setSelectedBalconyDirection] = useState<string | null>(null);
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleReset = () => {
    setSelectedPrice(0);
    setSelectedArea(0);
    setSelectedBedrooms(null);
    setSelectedBathrooms(null);
    setSelectedDirection(null);
    setSelectedBalconyDirection(null);
    setSelectedLegal(null);
    setSelectedFurniture(null);
  };

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
          {/* Tabs */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              onClick={() => setActiveTab("buy")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === "buy" ? "bg-card text-foreground shadow" : "text-muted-foreground"
              )}
            >
              Tìm mua
            </button>
            <button
              onClick={() => setActiveTab("rent")}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                activeTab === "rent" ? "bg-card text-foreground shadow" : "text-muted-foreground"
              )}
            >
              Tìm thuê
            </button>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Loại bất động sản</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors">
              <span className="text-primary text-sm">+ Thêm</span>
            </button>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Khu vực & Dự án</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary transition-colors">
              <span className="text-muted-foreground text-sm">Chọn khu vực</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Khoảng giá</h3>
            <div className="space-y-2">
              {priceRanges.map((range, index) => (
                <label
                  key={range}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPrice === index ? "border-primary" : "border-border"
                    )}
                  >
                    {selectedPrice === index && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Area Range */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Diện tích</h3>
            <div className="space-y-2">
              {areaRanges.map((range, index) => (
                <label
                  key={range}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedArea === index ? "border-primary" : "border-border"
                    )}
                  >
                    {selectedArea === index && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-sm">{range}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Số phòng ngủ</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, "5+"].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedBedrooms(num === "5+" ? 5 : (num as number))}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    selectedBedrooms === (num === "5+" ? 5 : num)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Bathrooms */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Số phòng tắm, vệ sinh</h3>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, "5+"].map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedBathrooms(num === "5+" ? 5 : (num as number))}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm font-medium transition-colors",
                    selectedBathrooms === (num === "5+" ? 5 : num)
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* House Direction */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Hướng nhà</h3>
            <div className="flex justify-center mb-4">
              <div className="direction-compass">
                {directions.map((dir, index) => {
                  const angle = index * 45 - 90;
                  const radius = 50;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <button
                      key={dir}
                      onClick={() => setSelectedDirection(dir)}
                      className={cn("direction-item", selectedDirection === dir && "active")}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {dir}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Balcony Direction */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Hướng ban công</h3>
            <div className="flex justify-center mb-4">
              <div className="direction-compass">
                {directions.map((dir, index) => {
                  const angle = index * 45 - 90;
                  const radius = 50;
                  const x = Math.cos((angle * Math.PI) / 180) * radius;
                  const y = Math.sin((angle * Math.PI) / 180) * radius;
                  return (
                    <button
                      key={dir}
                      onClick={() => setSelectedBalconyDirection(dir)}
                      className={cn("direction-item", selectedBalconyDirection === dir && "active")}
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      {dir}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Legal Status */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Pháp lý</h3>
            <div className="flex flex-wrap gap-2">
              {legalStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedLegal(status)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                    selectedLegal === status
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Furniture */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Nội thất</h3>
            <div className="flex flex-wrap gap-2">
              {furnitureOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedFurniture(option)}
                  className={cn(
                    "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                    selectedFurniture === option
                      ? "border-primary bg-accent text-primary"
                      : "border-border hover:border-primary"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleReset}>
            Đặt lại
          </Button>
          <Button className="flex-1" onClick={onClose}>
            Xem kết quả
          </Button>
        </div>
      </div>
    </div>
  );
}
