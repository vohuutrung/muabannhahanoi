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
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PropertyGallery } from "@/components/PropertyGallery";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/properties";
import { formatCurrency } from "@/lib/utils";

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

  // Tin tương tự: đơn giản lấy 4 tin khác
  const similar = mockProperties.filter((p) => p.id !== property.id).slice(0, 4);

  return (
    <>
      <div className="container py-4 lg:py-8 space-y-6 pb-24 md:pb-10">

        {/* BREADCRUMB - gọn, sạch, không lộn xộn */}
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Nhà đất bán", href: "/nha-dat-ban" },
            { label: property.district || "", href: "#" },
            { label: property.title, href: "#" },
          ]}
        />

        {/* TIÊU ĐỀ + FAVORITE */}
        <div className="flex justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold leading-snug">
              {property.title}
            </h1>

            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-primary" />
              {property.address}
            </p>

            {/* META: chỉ hiển thị ngày đăng (fix lôm nhôm) */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
              <Clock className="w-3 h-3" />
              <span>{property.postedDate || "Mới đăng"}</span>
            </div>
          </div>

          <button
            onClick={() => toggleFavorite(property.id)}
            className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 ${
              isFavorited
                ? "bg-primary text-white"
                : "bg-background hover:bg-primary/10"
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorited ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* GIÁ + DIỆN TÍCH */}
        <div className="space-y-1">
          <div className="text-2xl sm:text-3xl font-bold text-primary">
            {formatCurrency(property.price)}
          </div>

          <div className="text-sm text-muted-foreground flex flex-wrap gap-4">
            {property.pricePerM2 && <span>~{property.pricePerM2}/m²</span>}
            <span>Diện tích: {property.area}</span>
          </div>
        </div>

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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* CỘT TRÁI (2/3): MÔ TẢ + ĐẶC ĐIỂM + MAP + TIN TƯƠNG TỰ */}
          <div className="lg:col-span-2 space-y-6">

            {/* THÔNG TIN TỔNG QUAN */}
            <section className="bg-card p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Thông tin tổng quan</h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <InfoItem icon={<Layers className="w-4 h-4" />} label="Diện tích" value={property.area} />
                {property.bedrooms && (
                  <InfoItem icon={<BedDouble className="w-4 h-4" />} label="Phòng ngủ" value={property.bedrooms} />
                )}
                {property.bathrooms && (
                  <InfoItem icon={<Bath className="w-4 h-4" />} label="Phòng tắm" value={property.bathrooms} />
                )}
                {property.floors && (
                  <InfoItem icon={<Layers className="w-4 h-4" />} label="Số tầng" value={property.floors} />
                )}
              </div>
            </section>

            {/* MÔ TẢ */}
            <section className="bg-card p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Mô tả chi tiết</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                {property.description || "Chưa có mô tả chi tiết."}
              </p>
            </section>

            {/* ĐẶC ĐIỂM BĐS */}
            <section className="bg-card p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Đặc điểm bất động sản</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <DetailRow label="Loại hình" value="Nhà riêng / Nhà phố" />
                <DetailRow label="Số tầng" value={property.floors || "—"} />
                <DetailRow label="Phòng ngủ" value={property.bedrooms || "—"} />
                <DetailRow label="Phòng tắm" value={property.bathrooms || "—"} />
              </div>
            </section>

            {/* MAP */}
            <section className="bg-card p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-3">Vị trí trên bản đồ</h2>
              <p className="text-sm text-muted-foreground mb-2">{property.address}</p>

              <div className="rounded-lg overflow-hidden border">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(property.address)}&output=embed`}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
            </section>

            {/* TIN TƯƠNG TỰ – FIX LỖI ẢNH */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">Tin đăng tương tự</h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {similar.map((item) => (
                  <a
                    key={item.id}
                    href={`/nha-dat-ban/${item.id}`}
                    className="block bg-card border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
                  >
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3">
                      <div className="font-semibold text-primary text-sm line-clamp-1">
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

          </div>

          {/* CỘT PHẢI: BOX MÔI GIỚI */}
          <div className="space-y-6">
            <section className="bg-card p-4 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3">
                {/* AVATAR TRÒN */}
                <img
                  src="/images/agent-trung.jpg"
                  alt="Võ Hữu Trung"
                  className="w-14 h-14 rounded-full object-cover border"
                />

                <div>
                  <h3 className="font-semibold text-base">Võ Hữu Trung</h3>
                  <p className="text-xs text-muted-foreground">
                    Chuyên viên tư vấn BĐS Hà Nội
                  </p>
                </div>
              </div>

              {/* SĐT ĐẸP */}
              <div className="mt-4 flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-lg">
                  099 666 8800
                </span>
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Liên hệ trực tiếp để được tư vấn & gửi thêm video chi tiết.
              </p>

              {/* NÚT GỌI / ZALO */}
              <div className="flex flex-col gap-2 mt-4">
                <a
                  href="tel:0996668800"
                  className="bg-primary text-white text-sm font-semibold rounded-md py-2 flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Gọi ngay
                </a>

                <a
                  href="https://zalo.me/0996668800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-primary text-primary text-sm font-semibold rounded-md py-2 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Nhắn Zalo
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* FOOTER MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md md:hidden z-50">
        <div className="flex">
          <FooterButton icon={<Phone className="w-5 h-5 mb-1" />} label="Gọi" href="tel:0996668800" />

          <FooterButton
            icon={<MessageCircle className="w-5 h-5 mb-1" />}
            label="Zalo"
            href="https://zalo.me/0996668800"
          />

          <button
            onClick={() => toggleFavorite(property.id)}
            className="flex-1 flex flex-col items-center justify-center py-2 text-sm"
          >
            <Heart
              className={`w-5 h-5 mb-1 ${
                isFavorited ? "text-red-500 fill-red-500" : "text-primary"
              }`}
            />
            {isFavorited ? "Đã lưu" : "Lưu tin"}
          </button>
        </div>
      </div>
    </>
  );
}

/* COMPONENT NHỎ CHO ĐẸP CODE */

function InfoItem({ icon, label, value }) {
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

function FooterButton({ icon, label, href }) {
  return (
    <a
      href={href}
      className="flex-1 flex flex-col items-center justify-center py-2 text-sm border-r"
    >
      {icon}
      {label}
    </a>
  );
}
