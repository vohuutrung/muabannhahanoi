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
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { supabase } from "@/integrations/supabase/client";

interface Property {
  id: string;
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
  slug: string;
  created_at: string;
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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
      // Fetch property by slug
      const { data: property, error } = await supabase
        .from("properties")
        .select("*")
        .eq("slug", slugParam)
        .maybeSingle();

      if (error) {
        console.error("Error fetching property:", error);
        setLoading(false);
        return;
      }

      if (property) {
        setProperty(property as Property);
        
        // Get similar properties (same district, different id)
        const { data: similarData } = await supabase
          .from("properties")
          .select("*")
          .eq("district", property.district)
          .neq("id", property.id)
          .limit(4);
        
        setSimilarProperties((similarData || []) as Property[]);
      }
    } catch (error) {
      console.error("Error:", error);
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

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

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
        <p className="text-muted-foreground">Tin đăng này có thể đã bị xóa hoặc không tồn tại.</p>
        <Link to="/" className="inline-block text-primary hover:underline">
          ← Quay về trang chủ
        </Link>
      </div>
    );
  }

  const isFavorited = favorites.includes(property.id);
  const address = [property.street, property.ward, property.district, property.city].filter(Boolean).join(", ");
  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"];

  return (
    <>
      <div className="container py-4 lg:py-8 space-y-6 lg:space-y-8 pb-24 md:pb-10">

        {/* BREADCRUMB */}
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-muted-foreground">
          <Breadcrumb
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Nhà đất bán", href: "/nha-dat-ban" },
              { label: property.district || "", href: "#" },
              { label: property.title || "", href: "#" },
            ]}
          />
        </div>

        {/* HEADER */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                {property.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-tight mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{address}</span>
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

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDate(property.created_at)}</span>
            </div>
          </div>
        </div>

        {/* GIÁ */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {formatPrice(property.price)}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {property.area > 0 && <span>~{formatPrice(property.price / property.area)}/m²</span>}
              <span>Diện tích: {property.area} m²</span>
            </div>
          </div>
        </div>

        {/* LAYOUT CHÍNH */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* CỘT TRÁI */}
          <div className="lg:col-span-2 space-y-6">

            <PropertyGallery
              images={images}
              vipType={property.vip_type === "KIMCUONG" ? "VIP KIM CƯƠNG" : 
                       property.vip_type === "VANG" ? "VIP VÀNG" :
                       property.vip_type === "BAC" ? "VIP BẠC" : undefined}
            />

            {/* TỔNG QUAN */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Thông tin tổng quan</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Info icon={<Layers className="w-4 h-4 text-primary" />} label="Diện tích" value={`${property.area} m²`} />

                {property.bedrooms && (
                  <Info icon={<BedDouble className="w-4 h-4 text-primary" />} label="Phòng ngủ" value={property.bedrooms} />
                )}

                {property.bathrooms && (
                  <Info icon={<Bath className="w-4 h-4 text-primary" />} label="Phòng tắm" value={property.bathrooms} />
                )}

                {property.floors && (
                  <Info icon={<Layers className="w-4 h-4 text-primary" />} label="Số tầng" value={property.floors} />
                )}
              </div>
            </section>

            {/* MÔ TẢ */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Mô tả chi tiết</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description || "Không có mô tả"}
              </p>
            </section>

            {/* ĐẶC ĐIỂM */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Đặc điểm bất động sản</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <DetailRow label="Loại hình" value="Nhà riêng / Nhà phố" />
                <DetailRow label="Số tầng" value={property.floors || "—"} />
                <DetailRow label="Số phòng ngủ" value={property.bedrooms || "—"} />
                <DetailRow label="Số phòng tắm" value={property.bathrooms || "—"} />
              </div>
            </section>

            {/* MAP */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Vị trí trên bản đồ</h2>
              <p className="text-sm text-muted-foreground mb-2">{address}</p>

              <div className="w-full overflow-hidden rounded-lg border">
                <iframe
                  title="Bản đồ vị trí"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    address
                  )}&output=embed`}
                  className="w-full h-64 border-0"
                  loading="lazy"
                />
              </div>
            </section>

            {/* TIN TƯƠNG TỰ */}
            {similarProperties.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold">Tin đăng tương tự</h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {similarProperties.map((item) => (
                    <Link
                      key={item.id}
                      to={`/nha-dat-ban/${item.slug}`}
                      className="block rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={item.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80"}
                          alt={item.title || "Property"}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-md line-clamp-1">
                          {item.title}
                        </div>
                      </div>

                      <div className="p-3 space-y-1">
                        <div className="text-sm font-semibold text-primary">{formatPrice(item.price)}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {[item.street, item.ward, item.district].filter(Boolean).join(", ")}
                        </div>
                        <div className="text-xs text-muted-foreground">Diện tích: {item.area} m²</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* CỘT PHẢI – LIÊN HỆ GHIM */}
          <div className="space-y-4 lg:space-y-6 lg:sticky lg:top-24 h-fit">
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-4 shadow-sm border">

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <img
                    src="/images/agent-trung.jpg"
                    alt="Võ Hữu Trung"
                    className="w-full h-full object-cover"
                  />
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

              <div className="flex flex-col gap-2">
                <a
  href="tel:0996668800"
  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow-sm justify-center whitespace-nowrap min-w-[130px] font-semibold text-sm"
>
  <Phone className="w-4 h-4" />
  <span>099 666 8800</span>
</a>


                <a
                  href="https://zalo.me/0996668800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-primary text-primary py-2.5 text-sm font-semibold bg-background"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn Zalo
                </a>
              </div>

            </section>
          </div>

        </div>
      </div>

      {/* FOOTER MOBILE CHUẨN BATDONGSAN */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 md:hidden p-2">
        <div className="flex items-center gap-2">

          {/* Avatar môi giới */}
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src="/agent-trung.jpg"
              alt="Võ Hữu Trung"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Zalo */}
          <a
            href="https://zalo.me/0996668800"
            className="flex items-center gap-2 bg-white border px-3 py-2 rounded-lg shadow-sm flex-1 justify-center"
          >
            <img src="/zalo-icon.png" className="w-5 h-5" />
            <span className="font-medium text-sm">Zalo</span>
          </a>

          {/* Gọi điện */}
          <a
            href="tel:0996668800"
            className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-lg shadow-sm flex-1 justify-center"
          >
            <Phone className="w-4 h-4" />
            <span className="font-semibold text-sm">099 666 8800</span>
          </a>
        </div>
      </div>
    </>
  );
}

/* COMPONENTS */
function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="font-medium text-sm">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
