import { useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Grid3X3, List, ChevronDown, MapPin, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { FilterModal } from "@/components/FilterModal";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/data/mockData";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Giá thấp đến cao", value: "price-asc" },
  { label: "Giá cao đến thấp", value: "price-desc" },
  { label: "Diện tích lớn nhất", value: "area-desc" },
];

export default function Listing() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Trang chủ
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Nhà đất bán</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Nhà đất bán tại Việt Nam
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Hiện có <span className="text-primary font-semibold">15,234</span> bất động sản
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Button
                variant="filter"
                onClick={() => setFilterModalOpen(true)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="filter"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="min-w-[140px] justify-between"
                >
                  {selectedSort.label}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", sortOpen && "rotate-180")} />
                </Button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-card rounded-lg shadow-lg border border-border py-2 min-w-[180px] z-10 animate-fade-in">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedSort(option);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                          selectedSort.value === option.value && "text-primary font-medium"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="hidden md:flex border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="filter-chip active">
              Hà Nội <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
            </span>
            <span className="filter-chip active">
              1-3 tỷ <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
            </span>
            <span className="filter-chip active">
              2+ phòng ngủ <button className="ml-1 text-primary-foreground/70 hover:text-primary-foreground">×</button>
            </span>
            <button className="text-primary text-sm font-medium hover:underline">
              Xóa tất cả
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-background">
        <div className="container-custom py-6">
          <div className="flex gap-6">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-72 shrink-0">
              <FilterSidebar />
            </aside>

            {/* Listings */}
            <div className="flex-1">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {mockProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {mockProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} variant="horizontal" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                <span className="text-muted-foreground">...</span>
                <Button variant="outline" size="sm" className="w-10">
                  50
                </Button>
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} />
    </Layout>
  );
}
