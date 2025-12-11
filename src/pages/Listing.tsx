import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Grid3X3, List, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCardNew } from "@/components/PropertyCardNew";
import { FilterTabs } from "@/components/FilterTabs";
import { ActiveFilters } from "@/components/ActiveFilters";
import { FilterModal } from "@/components/FilterModal";
import { Button } from "@/components/ui/button";
import { SORT_OPTIONS, FilterState } from "@/types/property";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

export default function Listing() {
  const [searchParams] = useSearchParams();
  const initialDistrict = searchParams.get("district") || undefined;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH dữ liệu REAL từ SUPABASE
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("properties").select("*");

      if (!error && data) {
        setProperties(data);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-10 text-center">Đang tải dữ liệu...</div>;
  }

  // filter sẽ chạy trên properties (dữ liệu thật)
  // TODO: áp dụng bộ lọc nếu cần


  return (
    <Layout>
      <Helmet>
        <title>Nhà đất bán tại Hà Nội - Mua bán bất động sản giá tốt | BatDongSan</title>
        <meta 
          name="description" 
          content="Tìm kiếm nhà đất bán tại Hà Nội. Hàng nghìn tin đăng mua bán nhà riêng, căn hộ, biệt thự, đất nền giá tốt. Cập nhật liên tục, thông tin chính xác." 
        />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Nhà đất bán</span>
          </div>
        </div>
      </div>

      {/* Header & Filters */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="container-custom py-4">
          {/* Title & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Nhà đất bán tại Hà Nội
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Hiện có <span className="text-primary font-semibold">{filteredProperties.length}</span> bất động sản
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
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 rounded-full bg-primary-foreground text-primary text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <Button
                  variant="filter"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="min-w-[160px] justify-between"
                >
                  {selectedSort.label}
                  <ChevronDown className={cn("w-4 h-4 transition-transform", sortOpen && "rotate-180")} />
                </Button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-card rounded-lg shadow-lg border border-border py-2 min-w-[200px] z-50 animate-fade-in">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          updateFilter("sortBy", option.value as FilterState["sortBy"]);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                          filters.sortBy === option.value && "text-primary font-medium bg-accent"
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
                  aria-label="Xem dạng lưới"
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                  aria-label="Xem dạng danh sách"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Tabs - Desktop */}
          <div className="hidden lg:block">
            <FilterTabs
              filters={filters}
              onUpdateFilter={updateFilter}
              onToggleArrayFilter={toggleArrayFilter}
            />
          </div>

          {/* Active Filters */}
          <div className="mt-4">
            <ActiveFilters
              labels={getActiveFilterLabels}
              onClear={clearFilter}
              onReset={resetFilters}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-background">
        <div className="container-custom py-6">
          {filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                Không tìm thấy bất động sản phù hợp với bộ lọc của bạn.
              </p>
              <Button onClick={resetFilters} variant="outline">
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCardNew key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProperties.map((property) => (
                    <PropertyCardNew key={property.id} property={property} variant="horizontal" />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>
                  Trước
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button
                    key={page}
                    variant={page === 1 ? "default" : "outline"}
                    size="sm"
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
                <Button variant="outline" size="sm">
                  Sau
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filter Modal - Mobile */}
      <FilterModal 
        isOpen={filterModalOpen} 
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onUpdateFilter={updateFilter}
        onToggleArrayFilter={toggleArrayFilter}
        onReset={resetFilters}
        resultCount={filteredProperties.length}
      />
    </Layout>
  );
}
