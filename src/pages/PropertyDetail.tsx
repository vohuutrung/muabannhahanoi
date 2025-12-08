import { useParams } from "react-router-dom";
import { Heart, Bath, BedDouble, Layers, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/properties";

export default function PropertyDetail() {
  const { slug } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  const property = mockProperties.find((p) => p.slug === slug);

  if (!property) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold">Không tìm thấy tin</h2>
      </div>
    );
  }

  const isFavorited = favorites.includes(property.id);

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
        images={property.images} 
        vipType={property.isVip ? "VIP DIAMOND" : property.isHot ? "HOT" : undefined}
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
        <p className="text-muted-foreground leading-relaxed">{property.description}</p>
      </div>
    </div>
  );
}
