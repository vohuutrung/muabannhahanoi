import { useParams } from "react-router-dom";
import {
  Heart,
  Bath,
  BedDouble,
  Layers,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  User,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { formatCurrency } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/properties";

export default function PropertyDetail() {
  // Lấy ID từ URL
  const { id } = useParams();
  const { favorites, toggleFavorite } = useFavorites();

  // Tìm bất động sản theo ID
  const property = mockProperties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy tin</h2>
      </div>
    );
  }

  const isFavorited = favorites.includes(property.id);

  // Gợi ý tin tương tự (cùng quận nếu có, hoặc đơn giản là khác ID)
  const similarProperties = mockProperties
    .filter((p) => p.id !== property.id)
    .slice(0, 4);

  return (
    <>
      <div className="container py-4 lg:py-8 space-y-6 lg:space-y-8 pb-20 md:pb-10">
        {/* BREADCRUMB */}
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

        {/* HEADER: TIÊU ĐỀ + NÚT LƯU + NGÀY ĐĂNG */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                {property.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-tight mt-1 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{property.address}</span>
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
              <Heart
                className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{property.postedDate || "Mới đăng"}</span>
            </div>
            {property.district && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{property.district}</span>
              </div>
            )}
          </div>
        </div>

        {/* GIÁ + THÔNG TIN TÓM TẮT */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-primary">
              {formatCurrency(property.price)}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {property.pricePerM2 && (
                <span>~{property.pricePerM2} /m²</span>
              )}
              <span>Diện tích: {property.area}</span>
            </div>
          </div>
        </div>

        {/* GALLERY + CỘT THÔNG TIN BÊN PHẢI */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cột trái: gallery + mô tả */}
          <div className="lg:col-span-2 space-y-6">
            {/* GALLERY */}
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

            {/* THÔNG TIN TỔNG QUAN */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Thông tin tổng quan</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">{property.area}</div>
                    <div className="text-xs text-muted-foreground">
                      Diện tích
                    </div>
                  </div>
                </div>

                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <BedDouble className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">
                        {property.bedrooms} phòng
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Phòng ngủ
                      </div>
                    </div>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">
                        {property.bathrooms} phòng
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Phòng tắm
                      </div>
                    </div>
                  </div>
                )}

                {property.floors && (
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <div>
                      <div className="font-medium">{property.floors} tầng</div>
                      <div className="text-xs text-muted-foreground">
                        Số tầng
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* MÔ TẢ CHI TIẾT */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Mô tả chi tiết</h2>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description || "Chưa có mô tả chi tiết cho bài đăng này."}
              </p>
            </section>

            {/* ĐẶC ĐIỂM BẤT ĐỘNG SẢN (dùng lại các field có sẵn) */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Đặc điểm bất động sản</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Loại hình</span>
                  <span className="font-medium text-foreground">
                    Nhà riêng / Nhà phố
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số tầng</span>
                  <span className="font-medium text-foreground">
                    {property.floors || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số phòng ngủ</span>
                  <span className="font-medium text-foreground">
                    {property.bedrooms || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số phòng tắm</span>
                  <span className="font-medium text-foreground">
                    {property.bathrooms || "—"}
                  </span>
                </div>
              </div>
            </section>

            {/* BẢN ĐỒ (dùng địa chỉ để nhúng Google Maps) */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-3">
              <h2 className="text-lg font-semibold">Vị trí trên bản đồ</h2>
              <div className="text-sm text-muted-foreground mb-2">
                {property.address}
              </div>
              <div className="w-full overflow-hidden rounded-lg border">
                <iframe
                  title="Bản đồ vị trí"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    property.address
                  )}&output=embed`}
                  className="w-full h-64 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
          </div>

          {/* Cột phải: Thông tin môi giới */}
          <div className="space-y-4 lg:space-y-6">
            {/* BOX THÔNG TIN MÔI GIỚI – BẠN */}
            <section className="bg-card rounded-lg p-4 sm:p-5 space-y-4 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-base">
                    Võ Hữu Trung
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Chuyên viên tư vấn BĐS Hà Nội
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-lg text-primary">
                    0996 668 800
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Liên hệ trực tiếp để được tư vấn, gửi thêm ảnh, video chi tiết và sắp xếp lịch xem nhà.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <a
                  href="tel:0996668800"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-semibold"
                >
                  <Phone className="w-4 h-4" />
                  Gọi ngay
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

        {/* TIN ĐĂNG TƯƠNG TỰ */}
        {similarProperties.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Tin đăng tương tự</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProperties.map((item) => (
                <a
                  key={item.id}
                  href={`/nha-dat-ban/${item.id}`}
                  className="block rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-black/40 text-white text-xs px-2 py-1 rounded-md line-clamp-1">
                      {item.title}
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-sm font-semibold text-primary">
                      {item.price}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {item.address}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Diện tích: {item.area}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* STICKY FOOTER MOBILE: GỌI / ZALO / LƯU TIN */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t shadow-lg md:hidden">
        <div className="max-w-4xl mx-auto flex">
          <a
            href="tel:0996668800"
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs border-r"
          >
            <Phone className="w-5 h-5 mb-1 text-primary" />
            <span>Gọi ngay</span>
          </a>
          <a
            href="https://zalo.me/0996668800"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs border-r"
          >
            <MessageCircle className="w-5 h-5 mb-1 text-primary" />
            <span>Nhắn Zalo</span>
          </a>
          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 text-xs"
          >
            <Heart
              className={`w-5 h-5 mb-1 ${
                isFavorited ? "text-red-500 fill-red-500" : "text-primary"
              }`}
            />
            <span>{isFavorited ? "Đã lưu tin" : "Lưu tin"}</span>
          </button>
        </div>
      </div>
    </>
  );
}
