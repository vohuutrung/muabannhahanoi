import { useParams } from "react-router-dom";
import { Heart, Bath, BedDouble, Layers, MapPin } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import mockProperties from "@/data/mockProperties"; // CHẮC CHẮN CÓ FILE NÀY TRONG LOVABLE

export default function PropertyDetail() {
  const { slug } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  // Lấy property theo slug
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>

        <button
          onClick={() => toggleFavorite(property.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            isFavorited
              ? "bg-primary text-white"
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
            ~{formatCurrency(property.pricePerM2)}/m²
          </span>
        )}
      </div>

      {/* Images */}
      <div className="grid gap-4">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full rounded-lg object-cover"
        />
        <div className="grid grid-cols-4 gap-2">
          {property.images.slice(1, 5).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={property.title}
              className="w-full h-24 rounded-md object-cover"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-primary" /> {property.bedrooms} phòng ngủ
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-primary" /> {property.bathrooms} phòng tắm
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> {property.area} m²
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> {property.address}
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className="text-xl font-bold mb-2">Mô tả chi tiết</h2>
        <p>{property.description}</p>
      </div>

    </div>
  );
}
