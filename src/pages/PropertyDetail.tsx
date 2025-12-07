import { Heart, Bath, BedDouble, Layers, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useFavorites } from "@/hooks/useFavorites";   // SỬA ĐÚNG IMPORT

interface PropertyDetailProps {
  property: {
    id: string;
    title: string;
    price: number;
    pricePerM2?: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    description: string;
    postedDate?: string;
    district?: string;
  };
}

export default function PropertyDetail({ property }: PropertyDetailProps) {
  const { favorites, toggleFavorite } = useFavorites();

  const isFavorited = favorites.includes(property.id);

  return (
    <div className="container py-6 space-y-6">

      <Breadcrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Nhà đất bán", href: "/nha-dat-ban" },
          { label: property.district || "Khu vực", href: "#" },
          { label: property.title, href: "#" },
        ]}
      />

      {/* Header + HEART BUTTON */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{property.title}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>

        <button
          onClick={() => toggleFavorite(property.id)}
          aria-label="Lưu tin"
          className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
            isFavorited
              ? "bg-primary text-primary-foreground"
              : "bg-background hover:bg-primary/10"
          }`}
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorited ? "fill-current animate-[pop_0.25s_ease-in-out]" : ""
            }`}
          />
        </button>
      </div>

      {/* PRICE */}
      <div className="text-3xl font-bold text-primary">
        {formatCurrency(property.price)}
        {property.pricePerM2 && (
          <span className="ml-2 text-base text-muted-foreground">
            ~{formatCurrency(property.pricePerM2)}/m²
          </span>
        )}
      </div>

      {/* IMAGES */}
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

      {/* INFO */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-primary" />
          <span>{property.bedrooms} phòng ngủ</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="w-5 h-5 text-primary" />
          <span>{property.bathrooms} phòng tắm</span>
        </div>
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" />
          <span>{property.area} m²</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span>{property.address}</span>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mô tả chi tiết</h2>
        <p className="leading-relaxed">{property.description}</p>
      </div>

    </div>
  );
}
