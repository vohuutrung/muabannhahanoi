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
  image?: string;
  images?: string[];
  postedDate: string;

  // VIP TYPE (QUAN TRỌNG)
  vipType?: "KIMCUONG" | "VANG" | "BAC" | null;
  isHot?: boolean;
  isVip?: boolean;
  district?: string;
  description?: string;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

interface PropertyCardProps {
  property: Property;
  variant?: "vertical" | "horizontal";
}

const PLACEHOLDER_IMAGE = "/placeholder.svg";

export function PropertyCard({ property, variant = "vertical" }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  // Build unique image array: use images array if available, fallback to single image
  const allImages = property.images?.length 
    ? [...new Set(property.images)] // Remove duplicates
    : property.image 
      ? [property.image] 
      : [];
  
  // Get up to 4 unique images, fill remaining slots with placeholder
  const previewImages = [
    allImages[0] || PLACEHOLDER_IMAGE,
    allImages[1] || PLACEHOLDER_IMAGE,
    allImages[2] || PLACEHOLDER_IMAGE,
    allImages[3] || PLACEHOLDER_IMAGE,
  ];
  
  const mainImage = previewImages[0];

  // ---------------------------
  // HORIZONTAL — KHÔNG ĐỤNG VÀO
  // ---------------------------
  const slug = slugify(property.title);

  if (variant === "horizontal") {
    return (
      <Link to={`/nha-dat-ban/${slug}`} className="property-card flex gap-4 p-3">
        <div className="relative w-32 h-24 sm:w-40 sm:h-28 shrink-0 rounded-lg overflow-hidden">
          <img src={mainImage} alt={property.title} className="w-full h-full object-cover" />
          {property.isHot && <span className="badge-hot absolute top-2 left-2">HOT</span>}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-foreground mb-1">
            {property.title}
          </h3>

          <p className="text-price text-sm sm:text-base mb-1">
            {property.price} · <span className="text-muted-foreground font-normal">{property.area}</span>
          </p>
        </div>
      </Link>
    );
  }

  // ---------------------------
  // VERTICAL — TRANG CHỦ
  // ---------------------------
  const vip = property.vipType;

  return (
    <Link to={`/nha-dat-ban/${slug}`} className="property-card group">
      
      {/* ---------------------- */}
      {/* VIP KIM CƯƠNG — 1 TO + 3 NHỎ */}
      {/* ---------------------- */}
      {vip === "KIMCUONG" && (
        <div className="p-1">
          {/* ảnh to */}
          <div className="relative w-full h-[220px] mb-2">
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover rounded-lg"
            />

            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              VIP KIM CƯƠNG
            </span>

            <button
              onClick={handleFavoriteClick}
              className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Heart className={cn("w-4 h-4", favorited && "fill-red-500")} />
            </button>
          </div>

          {/* 3 ảnh nhỏ - only show if we have more than 1 image */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-3 gap-1">
              {previewImages.slice(1, 4).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${property.title} ${idx + 2}`}
                  className={cn(
                    "w-full h-[90px] object-cover rounded-md",
                    img === PLACEHOLDER_IMAGE && "opacity-50"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---------------------- */}
      {/* VIP VÀNG / BẠC — 1 TO TRÁI + 2 NHỎ PHẢI */}
      {/* ---------------------- */}
      {/* VIP VÀNG / BẠC */}
{(vip === "VANG" || vip === "BAC") && (
  <div className="p-1">
    
    {/* Ảnh to phía trên */}
    <div className="relative w-full h-[220px] mb-2">
      <img
        src={mainImage}
        alt={property.title}
        className="w-full h-full object-cover rounded-lg"
      />

      <span
        className={cn(
          "absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-md",
          vip === "VANG" ? "bg-amber-500 text-white" : "bg-slate-400 text-white"
        )}
      >
        VIP {vip === "VANG" ? "VÀNG" : "BẠC"}
      </span>

      <button
        onClick={handleFavoriteClick}
        className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
      >
        <Heart className={cn("w-4 h-4", favorited && "fill-red-500")} />
      </button>
    </div>

    {/* 2 ảnh nhỏ phía dưới - only show if we have more than 1 image */}
    {allImages.length > 1 && (
      <div className="grid grid-cols-2 gap-2">
        <img
          src={previewImages[1]}
          alt={`${property.title} 2`}
          className={cn(
            "w-full h-[100px] object-cover rounded-lg",
            previewImages[1] === PLACEHOLDER_IMAGE && "opacity-50"
          )}
        />
        <img
          src={previewImages[2]}
          alt={`${property.title} 3`}
          className={cn(
            "w-full h-[100px] object-cover rounded-lg",
            previewImages[2] === PLACEHOLDER_IMAGE && "opacity-50"
          )}
        />
      </div>
    )}

  </div>
)}



      {/* ---------------------- */}
      {/* TIN THƯỜNG — ẢNH MẶC ĐỊNH */}
      {/* ---------------------- */}
      {!vip && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 bg-card/80 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Heart className={cn("w-4 h-4", favorited && "fill-red-500")} />
          </button>
        </div>
      )}

      {/* ---------------------- */}
      {/* NỘI DUNG */}
      {/* ---------------------- */}
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 mb-2 group-hover:text-primary transition-colors">
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

        <div className="flex items-center gap-3 text-muted-foreground text-sm border-t pt-3">
          <span className="flex items-center gap-1"><Layers className="w-4 h-4" /> {property.area}</span>
          {property.bedrooms && <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" /> {property.bedrooms}</span>}
          {property.bathrooms && <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {property.bathrooms}</span>}
        </div>

        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
          <Clock className="w-3 h-3" />
          <span>{property.postedDate}</span>
        </div>
      </div>
    </Link>
  );
}
