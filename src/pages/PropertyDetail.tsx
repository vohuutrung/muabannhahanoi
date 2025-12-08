import { useParams } from "react-router-dom";
import { Heart, Bath, BedDouble, Layers, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/properties";

export default function PropertyDetail() {
  // LẤY ID TỪ URL (KHÔNG DÙNG SLUG NỮA)
  const { id } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  // TÌM PROPERTY THEO ID
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
  <div className="container py-4 space-y-5">

    {/* Breadcrumb – Tối ưu mobile */}
    <div className="text-sm text-muted-foreground truncate">
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Nhà đất bán", href: "/nha-dat-ban" },
          { label: property.district || "", href: "#" },
          { label: property.title, href: "#" },
        ]}
        className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap"
      />
    </div>

    {/* Title + Favorite */}
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1">
        <h1 className="text-xl font-bold leading-snug">
          {property.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1 leading-tight">
          {property.address}
        </p>
      </div>

      <button
        onClick={() => toggleFavorite(property.id)}
        className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
          isFavorited
            ? "bg-primary text-primary-foreground"
            : "bg-background hover:bg-primary/10"
        }`}
      >
        <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
      </button>
    </div>

    {/* Price */}
    <div className="text-2xl font-bold text-primary">
      {formatCurrency(property.price)}
      {property.pricePerM2 && (
        <span className="ml-1.5 text-sm text-muted-foreground">
          ~{property.pricePerM2}
        </span>
      )}
    </div>

    {/* Gallery – Badge nhỏ lại cho mobile */}
    <div className="rounded-lg overflow-hidden">
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
        badgeClass="text-[10px] px-2 py-0.5"
      />
    </div>

    {/* Info grid – tối ưu mobile */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-card p-3 rounded-lg text-sm">
      {property.bedrooms && (
        <div className="flex items-center gap-1.5">
          <BedDouble className="w-4 h-4 text-primary" /> {property.bedrooms} ngủ
        </div>
      )}
      {property.bathrooms && (
        <div className="flex items-center gap-1.5">
          <Bath className="w-4 h-4 text-primary" /> {property.bathrooms} tắm
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <Layers className="w-4 h-4 text-primary" /> {property.area}
      </div>
      <div className="flex items-center gap-1.5">
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


  return (
    <div className="container py-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Nhà đất bán", href: "/nha-dat-ban" },
          { label: property.district || "", href: "#" },
          { label: property.title, href: "#" },
        ]}
      />

      {/* Title + Favorite */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>

        <button
          onClick={() => toggleFavorite(property.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all flex-shrink-0 ${
            isFavorited
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-primary/10"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Price */}
      <div className="text-3xl font-bold text-primary">
        {formatCurrency(property.price)}
        {property.pricePerM2 && (
          <span className="ml-2 text-base text-muted-foreground">
            ~{property.pricePerM2}
          </span>
        )}
      </div>

      {/* Gallery */}
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

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card p-4 rounded-lg">
        {property.bedrooms && (
          <div className="flex items-center gap-2">
            <BedDouble className="w-5 h-5 text-primary" /> {property.bedrooms} phòng ngủ
          </div>
        )}
        {property.bathrooms && (
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-primary" /> {property.bathrooms} phòng tắm
          </div>
        )}
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> {property.area}
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> {property.address}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-bold mb-2">Mô tả chi tiết</h2>
        <p className="text-muted-foreground leading-relaxed">
          {property.description || "Chưa có mô tả."}
        </p>
      </div>
    </div>
  );
}
