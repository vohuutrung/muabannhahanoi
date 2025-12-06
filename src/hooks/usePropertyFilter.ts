import { useMemo, useState, useCallback } from "react";
import { 
  Property, 
  FilterState, 
  PRICE_RANGES, 
  AREA_RANGES,
  SortOption 
} from "@/types/property";

const initialFilterState: FilterState = {
  propertyType: "all",
  priceRange: "all",
  areaRange: "all",
  bedrooms: null,
  floors: null,
  direction: [],
  balconyDirection: [],
  legalStatus: [],
  interior: [],
  district: "all",
  priority: "all",
  sortBy: "newest",
};

export function usePropertyFilter(properties: Property[], initialDistrict?: string) {
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...initialFilterState,
    district: initialDistrict || "all",
  }));

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: string
  ) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((v) => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.propertyType !== "all") count++;
    if (filters.priceRange !== "all") count++;
    if (filters.areaRange !== "all") count++;
    if (filters.bedrooms !== null) count++;
    if (filters.floors !== null) count++;
    if (filters.direction.length > 0) count++;
    if (filters.balconyDirection.length > 0) count++;
    if (filters.legalStatus.length > 0) count++;
    if (filters.interior.length > 0) count++;
    if (filters.district !== "all") count++;
    if (filters.priority !== "all") count++;
    return count;
  }, [filters]);

  const getActiveFilterLabels = useMemo(() => {
    const labels: { key: keyof FilterState; label: string }[] = [];
    
    if (filters.propertyType !== "all") {
      const types: Record<string, string> = {
        "nha-rieng": "Nhà riêng",
        "nha-mat-pho": "Nhà mặt phố",
        "can-ho": "Căn hộ",
        "biet-thu": "Biệt thự",
        "dat-nen": "Đất nền",
        "shophouse": "Shophouse",
      };
      labels.push({ key: "propertyType", label: types[filters.propertyType] || filters.propertyType });
    }
    
    if (filters.priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.value === filters.priceRange);
      if (range) labels.push({ key: "priceRange", label: range.label });
    }
    
    if (filters.areaRange !== "all") {
      const range = AREA_RANGES.find((r) => r.value === filters.areaRange);
      if (range) labels.push({ key: "areaRange", label: range.label });
    }
    
    if (filters.bedrooms !== null) {
      labels.push({ key: "bedrooms", label: `${filters.bedrooms}+ phòng ngủ` });
    }
    
    if (filters.floors !== null) {
      labels.push({ key: "floors", label: `${filters.floors}+ tầng` });
    }
    
    if (filters.direction.length > 0) {
      labels.push({ key: "direction", label: `Hướng: ${filters.direction.join(", ")}` });
    }
    
    if (filters.legalStatus.length > 0) {
      labels.push({ key: "legalStatus", label: filters.legalStatus.join(", ") });
    }
    
    if (filters.interior.length > 0) {
      labels.push({ key: "interior", label: filters.interior.join(", ") });
    }
    
    if (filters.district !== "all") {
      const districts: Record<string, string> = {
        "dong-da": "Đống Đa",
        "thanh-xuan": "Thanh Xuân",
        "cau-giay": "Cầu Giấy",
        "ba-dinh": "Ba Đình",
        "hoan-kiem": "Hoàn Kiếm",
        "ha-dong": "Hà Đông",
        "hai-ba-trung": "Hai Bà Trưng",
      };
      labels.push({ key: "district", label: districts[filters.district] || filters.district });
    }
    
    if (filters.priority !== "all") {
      const priorities: Record<string, string> = {
        hot: "Tin HOT",
        vip: "Tin VIP",
        normal: "Tin thường",
      };
      labels.push({ key: "priority", label: priorities[filters.priority] });
    }
    
    return labels;
  }, [filters]);

  const clearFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: Array.isArray(initialFilterState[key]) 
        ? [] 
        : initialFilterState[key],
    }));
  }, []);

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Filter by property type
    if (filters.propertyType !== "all") {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    // Filter by price range
    if (filters.priceRange !== "all") {
      const range = PRICE_RANGES.find((r) => r.value === filters.priceRange);
      if (range) {
        result = result.filter(
          (p) => p.priceValue >= range.min && p.priceValue < range.max
        );
      }
    }

    // Filter by area range
    if (filters.areaRange !== "all") {
      const range = AREA_RANGES.find((r) => r.value === filters.areaRange);
      if (range) {
        result = result.filter(
          (p) => p.areaValue >= range.min && p.areaValue < range.max
        );
      }
    }

    // Filter by bedrooms
    if (filters.bedrooms !== null) {
      result = result.filter(
        (p) => p.bedrooms !== undefined && p.bedrooms >= filters.bedrooms!
      );
    }

    // Filter by floors
    if (filters.floors !== null) {
      result = result.filter(
        (p) => p.floors !== undefined && p.floors >= filters.floors!
      );
    }

    // Filter by direction
    if (filters.direction.length > 0) {
      result = result.filter(
        (p) => p.direction && filters.direction.includes(p.direction)
      );
    }

    // Filter by balcony direction
    if (filters.balconyDirection.length > 0) {
      result = result.filter(
        (p) => p.balconyDirection && filters.balconyDirection.includes(p.balconyDirection)
      );
    }

    // Filter by legal status
    if (filters.legalStatus.length > 0) {
      result = result.filter((p) =>
        filters.legalStatus.includes(p.legalStatus)
      );
    }

    // Filter by interior
    if (filters.interior.length > 0) {
      result = result.filter((p) => filters.interior.includes(p.interior));
    }

    // Filter by district
    if (filters.district !== "all") {
      result = result.filter((p) => p.district === filters.district);
    }

    // Filter by priority
    if (filters.priority !== "all") {
      switch (filters.priority) {
        case "hot":
          result = result.filter((p) => p.isHot);
          break;
        case "vip":
          result = result.filter((p) => p.isVip);
          break;
        case "normal":
          result = result.filter((p) => !p.isHot && !p.isVip);
          break;
      }
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        result.sort((a, b) => b.postedTimestamp - a.postedTimestamp);
        break;
      case "oldest":
        result.sort((a, b) => a.postedTimestamp - b.postedTimestamp);
        break;
      case "price-asc":
        result.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case "price-desc":
        result.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case "area-asc":
        result.sort((a, b) => a.areaValue - b.areaValue);
        break;
      case "area-desc":
        result.sort((a, b) => b.areaValue - a.areaValue);
        break;
    }

    return result;
  }, [properties, filters]);

  return {
    filters,
    filteredProperties,
    updateFilter,
    toggleArrayFilter,
    resetFilters,
    activeFiltersCount,
    getActiveFilterLabels,
    clearFilter,
  };
}
