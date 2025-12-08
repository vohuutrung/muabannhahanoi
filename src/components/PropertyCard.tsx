import { Link } from "react-router-dom";
import { BedDouble, Bath, Layers, MapPin, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

export interface Property {
  id: string;
  title: string;
  price: string;
  pricePerM2?: string;
  area: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  image: string;
  postedDate: string;
  isHot?: boolean;
  isVip?: boolean;
}

interface PropertyCardProps {
  property: Property;
  variant?: "vertical" | "horizontal";
}

export function PropertyCard({ property, variant = "vertical" }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  // 👉 Tạo 4 ảnh preview từ 1 ảnh gốc
  const previewImages = [
    property.image,
    `${property.image}?1`,
    `${property.image}?2`,
    `${property.image}?3`,
  ];

  // ---------------------------------------
  // HORIZONTAL (KHÔNG ĐỤNG VÀO)
  // ---------------------------------------
  if (variant === "horizontal") {
    return (
      <Link to={`/nha-dat-ban/${property.id}`} className="property-card flex gap-4 p-3">
        <div className="relative w-32 h-24 sm:w-40 sm:h-28 shrink-0 rounded-lg overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.isHot && <span className="badge-hot absolute top-2 left-2">HOT</span>}
          {property.isVip && <span className="badge-vip absolute top-2 left-2">VIP</span>}

          <button
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all",
              favorited
                ? "bg-primary text-primary-foreground"
                : "bg-card/80 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <Heart className={cn("w-3.5 h-3.5", favorited && "fill-current")} />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-foreground mb-1">
            {property.title}
          </h3>

          <p className="text-price text-sm sm:text-base mb-1">
            {property.price} · <span className="text-muted-foreground font-normal">{property.area}</span>
          </p>

          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" />
            <span className="line-clamp-1">{property.address}</span>
          </p>

          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            {property.bedrooms && (
              <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {property.bedrooms}</span>
            )}
            {property.bathrooms && (
              <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.bathrooms}</span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {property.postedDate}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ---------------------------------------
  // VERTICAL (TRANG CHỦ) — THÊM 4 ẢNH Ở ĐÂY
  // ---------------------------------------
  return (
    <Link to={`/nha-dat-ban/${property.id}`} className="property-card group">

      {/* ẢNH LỚN */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* preview 4 ảnh nhỏ */}
        {property.vipType === "KIMCUONG" && (
  <div className="mt-2">
    <div className="relative w-full h-[220px] mb-1">
      <img
        src={previewImages[0]}
        className="w-full h-full object-cover rounded-lg"
      />

      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
        VIP KIM CƯƠNG
      </span>
    </div>

    <div className="grid grid-cols-3 gap-1">
      {previewImages.slice(1, 4).map((img, idx) => (
        <img
          key={idx}
          src={img}
          className="w-full h-[90px] object-cover rounded-md"
        />
      ))}
    </div>
  </div>
)}


        {/* lớp overlay */}
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Trái tim */}
        <button
          onClick={handleFavoriteClick}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all",
            favorited
              ? "bg-primary text-primary-foreground"
              : "bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Heart className={cn("w-4 h-4", favorited && "fill-current")} />
        </button>

        {property.isHot && <span className="badge-hot absolute top-3 left-3">HOT</span>}
        {property.isVip && <span className="badge-vip absolute top-3 left-3">VIP</span>}
      </div>

      {/* NỘI DUNG GIỮ NGUYÊN */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors">
          {property.title}
        </h3>

        <p className="text-price text-lg mb-1">{property.price}</p>

        {property.pricePerM2 && (
          <p className="text-muted-foreground text-sm mb-2">{property.pricePerM2}</p>
        )}

        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="line-clamp-1">{property.address}</span>
        </p>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4" /> {property.area}
            </span>

            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" /> {property.bedrooms}
              </span>
            )}

            {property.bathrooms && (
              <span className="flex items-center gap-1">
                <Bath className="w-4 h-4" /> {property.bathrooms}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
          <Clock className="w-3 h-3" />
          <span>{property.postedDate}</span>
        </div>
      </div>
    </Link>
  );
}
