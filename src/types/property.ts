export interface Property {
  id: string;
  title: string;
  slug: string;
  price: string;
  priceValue: number; // in million VND
  pricePerM2?: string;
  area: string;
  areaValue: number; // in m2
  address: string;
  district: string;
  ward: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  direction?: string;
  balconyDirection?: string;
  legalStatus: string;
  interior: string;
  propertyType: string;
  images: string[];
  description: string;
  postedDate: string;
  postedTimestamp: number;
  isHot?: boolean;
  isVip?: boolean;
  contact: {
    name: string;
    phone: string;
  };
}

export type PropertyType = 
  | "all"
  | "nha-rieng"
  | "nha-mat-pho"
  | "can-ho"
  | "biet-thu"
  | "dat-nen"
  | "shophouse";

export type PriceRange = 
  | "all"
  | "under-500"
  | "500-800"
  | "800-1000"
  | "1000-2000"
  | "2000-3000"
  | "3000-5000"
  | "5000-7000"
  | "7000-10000"
  | "over-10000";

export type AreaRange = 
  | "all"
  | "under-30"
  | "30-50"
  | "50-80"
  | "80-100"
  | "100-150"
  | "over-150";

export type SortOption = 
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";

export type ListingPriority = "all" | "hot" | "vip" | "normal";

export interface FilterState {
  propertyType: string;
  priceRange: string;
  areaRange: string;
  bedrooms: number | null;
  floors: number | null;
  direction: string[];
  balconyDirection: string[];
  legalStatus: string[];
  interior: string[];
  district: string;
  priority: ListingPriority;
  sortBy: SortOption;
}

export const PROPERTY_TYPES = [
  { value: "all", label: "Tất cả loại" },
  { value: "nha-rieng", label: "Nhà riêng" },
  { value: "nha-mat-pho", label: "Nhà mặt phố" },
  { value: "can-ho", label: "Căn hộ chung cư" },
  { value: "biet-thu", label: "Biệt thự" },
  { value: "dat-nen", label: "Đất nền" },
  { value: "shophouse", label: "Shophouse" },
];

export const PRICE_RANGES = [
  { value: "all", label: "Tất cả mức giá", min: 0, max: Infinity },
  { value: "under-500", label: "Dưới 500 triệu", min: 0, max: 500 },
  { value: "500-800", label: "500 - 800 triệu", min: 500, max: 800 },
  { value: "800-1000", label: "800 triệu - 1 tỷ", min: 800, max: 1000 },
  { value: "1000-2000", label: "1 - 2 tỷ", min: 1000, max: 2000 },
  { value: "2000-3000", label: "2 - 3 tỷ", min: 2000, max: 3000 },
  { value: "3000-5000", label: "3 - 5 tỷ", min: 3000, max: 5000 },
  { value: "5000-7000", label: "5 - 7 tỷ", min: 5000, max: 7000 },
  { value: "7000-10000", label: "7 - 10 tỷ", min: 7000, max: 10000 },
  { value: "over-10000", label: "Trên 10 tỷ", min: 10000, max: Infinity },
];

export const AREA_RANGES = [
  { value: "all", label: "Tất cả diện tích", min: 0, max: Infinity },
  { value: "under-30", label: "Dưới 30 m²", min: 0, max: 30 },
  { value: "30-50", label: "30 - 50 m²", min: 30, max: 50 },
  { value: "50-80", label: "50 - 80 m²", min: 50, max: 80 },
  { value: "80-100", label: "80 - 100 m²", min: 80, max: 100 },
  { value: "100-150", label: "100 - 150 m²", min: 100, max: 150 },
  { value: "over-150", label: "Trên 150 m²", min: 150, max: Infinity },
];

export const DIRECTIONS = [
  "Đông", "Tây", "Nam", "Bắc", 
  "Đông Bắc", "Đông Nam", "Tây Bắc", "Tây Nam"
];

export const LEGAL_STATUSES = [
  "Sổ đỏ",
  "Sổ hồng", 
  "Hợp đồng mua bán",
  "Đang chờ sổ"
];

export const INTERIOR_OPTIONS = [
  "Đầy đủ nội thất",
  "Nội thất cơ bản",
  "Nhà thô"
];

export const HANOI_DISTRICTS = [
  { value: "all", label: "Tất cả quận/huyện" },
  { value: "ba-dinh", label: "Ba Đình" },
  { value: "hoan-kiem", label: "Hoàn Kiếm" },
  { value: "dong-da", label: "Đống Đa" },
  { value: "hai-ba-trung", label: "Hai Bà Trưng" },
  { value: "cau-giay", label: "Cầu Giấy" },
  { value: "thanh-xuan", label: "Thanh Xuân" },
  { value: "hoang-mai", label: "Hoàng Mai" },
  { value: "long-bien", label: "Long Biên" },
  { value: "tay-ho", label: "Tây Hồ" },
  { value: "nam-tu-liem", label: "Nam Từ Liêm" },
  { value: "bac-tu-liem", label: "Bắc Từ Liêm" },
  { value: "ha-dong", label: "Hà Đông" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "oldest", label: "Cũ nhất" },
  { value: "price-asc", label: "Giá thấp đến cao" },
  { value: "price-desc", label: "Giá cao đến thấp" },
  { value: "area-asc", label: "Diện tích nhỏ đến lớn" },
  { value: "area-desc", label: "Diện tích lớn đến nhỏ" },
];
