import { useParams } from "react-router-dom";
import { Heart, Bath, BedDouble, Layers, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/properties";

export default function PropertyDetail() {
  const { id } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy tin</h2>
      </div>
    );
  }

  const isFavorited = favorites.includes(property.id);

  return (
    <div className="container py-4 space-y-6">

      {/* Breadcrumb – Thu gọn, không để dài trên mobile */}
      <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Nhà đất bán", href: "/nha-dat-ban" },
            { label: property.district || "", href: "#" },
            { label: property.title, href: "#" },
          ]}
        />
      </div>

      {/* Title + Favorite */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold leading-snug">
            {property.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-tight mt-1">
            {property.address}
          </p>
        </div>

        <button
          onClick={() => toggleFavorite(property.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all shrink-0 ${
            isFavorited
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-primary/10"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Price */}
      <div className="text-2xl sm:text-3xl font-bold text-primary">
        {formatCurrency(property.price)}
        {property.pricePerM2 && (
          <span className="ml-2 text-base text-muted-foreground">
            ~{property.pricePerM2}
          </span>
        )}
      </div>

      {/* Gallery – tự động responsive */}
      <PropertyGallery
        images={property.images || [property.image]}
        vipType={
          property.vipType === "KIMCUONG"
            ? "VIP KIM CƯƠNG"
            : property.vipType === "VANG"
            ? "VIP VÀNG"
            : property.vipType === "BAC"
            ? "VIP BẠC"
            : undefined
        }
      />

      {/* Info GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card p-4 rounded-lg text-sm">
        {property.bedrooms && (
          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-primary" /> {property.bedrooms} ngủ
          </div>
        )}
        {property.bathrooms && (
          <div className="flex items-center gap-2">
            <Bath className="w-4 h-4 text-primary" /> {property.bathrooms} tắm
          </div>
        )}
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-primary" /> {property.area}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" /> {property.address}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-lg font-bold mb-2">Mô tả chi tiết</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {property.description || "Chưa có mô tả chi tiết cho bài đăng này."}
        </p>
      </div>
    </div>
  );
}
