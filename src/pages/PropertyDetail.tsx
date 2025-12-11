import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Heart,
  Bath,
  BedDouble,
  Layers,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  area: number;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  city: string | null;
  district: string;
  ward: string | null;
  street: string | null;
  alley: string | null;
  images: string[] | null;
  vip_type: string | null;
  created_at: string;
}

export default function PropertyDetail() {
  const { slug: slugParam } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchProperty();
  }, [slugParam]);

  const fetchProperty = async () => {
    try {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slugParam)
        .single();

      if (error || !data) {
        console.error("Không tìm thấy tin:", error);
        setProperty(null);
        setLoading(false);
        return;
      }

      setProperty(data);

      // Fetch similar properties
      const { data: allProps } = await supabase.from("properties").select("*");
      const similar = allProps
        ?.filter(
          (p: any) =>
            p.id !== data.id && p.district === data.district
        )
        .slice(0, 4);

      setSimilarProperties(similar || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1).replace(/\.0$/, "")} tỷ`;
    }
    return `${price} triệu`;
  };

  const isFavorited = property ? favorites.includes(property.id) : false;
  const address = property
    ? [property.street, property.ward, property.district, property.city]
        .filter(Boolean)
        .join(", ")
    : "";

  if (loading) {
    return (
      <div className="container py-10 text-center">
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container py-10 text-center space-y-4">
        <h2 className="text-xl font-bold">Không tìm thấy tin</h2>
        <p className="text-muted-foreground">
          Tin đăng này có thể đã bị xóa hoặc không tồn tại.
        </p>
        <Link to="/" className="inline-block text-primary hover:underline">
          ← Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="container py-4 lg:py-8 space-y-6 lg:space-y-8 pb-24 md:pb-10">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Nhà đất bán", href: "/nha-dat-ban" },
            { label: property.district || "", href: "#" },
            { label: property.title || "", href: "#" },
          ]}
        />

        {/* HEADER */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">
              {property.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              {address}
            </p>
          </div>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
              isFavorited
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-primary/10"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* GIÁ */}
        <div>
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {formatPrice(property.price)}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Diện tích: {property.area} m²</span>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* GALLERY */}
            <PropertyGallery
              images={
                property.images?.length
                  ? property.images
                  : [
                      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
                    ]
              }
              vipType={property.vip_type}
            />

            {/* MÔ TẢ */}
            <section className="bg-card rounded-lg p-4 space-y-3">
              <h2 className="text-lg font-semibold">Mô tả chi tiết</h2>
              <p className="text-sm">{property.description}</p>
            </section>

            {/* TIN TƯƠNG TỰ */}
            {similarProperties.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Tin tương tự</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarProperties.map((item) => (
                    <Link
                      key={item.id}
                      to={`/nha-dat-ban/${item.slug}`}
                      className="block rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <img
                        src={
                          item.images?.[0] ||
                          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"
                        }
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3 space-y-1">
                        <div className="text-sm font-semibold text-primary">
                          {formatPrice(item.price)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.district}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.area} m²
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* CỘT PHẢI - THÔNG TIN LIÊN HỆ */}
          <div className="space-y-4 lg:space-y-6 lg:sticky lg:top-24 h-fit">
            <section className="bg-card p-4 rounded-lg shadow-sm border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src="/images/agent-trung.jpg" />
                </div>
                <div>
                  <div className="font-semibold text-base">Võ Hữu Trung</div>
                  <div className="text-xs text-muted-foreground">
                    Chuyên viên tư vấn BĐS Hà Nội
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-semibold text-lg text-primary">
                  099 666 8800
                </span>
              </div>

              <a
                href="tel:0996668800"
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg justify-center"
              >
                <Phone className="w-4 h-4" />
                099 666 8800
              </a>

              <a
                href="https://zalo.me/0996668800"
                className="flex items-center gap-2 border text-primary px-4 py-2 rounded-lg justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Nhắn Zalo
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
