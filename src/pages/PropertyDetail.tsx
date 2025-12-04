import { Link, useParams } from "react-router-dom";
import { 
  MapPin, BedDouble, Bath, Layers, Compass, FileText, Sofa, 
  Calendar, Share2, Heart, Phone, MessageCircle, ChevronRight,
  Building2, Ruler, ArrowUpDown
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ImageSlider } from "@/components/ImageSlider";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { mockProperties, propertyImages } from "@/data/mockData";

export default function PropertyDetail() {
  const { id } = useParams();
  const property = mockProperties.find((p) => p.id === id) || mockProperties[0];

  const specs = [
    { icon: Layers, label: "Diện tích", value: property.area },
    { icon: BedDouble, label: "Phòng ngủ", value: `${property.bedrooms || 0} phòng` },
    { icon: Bath, label: "Phòng tắm", value: `${property.bathrooms || 0} phòng` },
    { icon: ArrowUpDown, label: "Số tầng", value: `${property.floors || 1} tầng` },
    { icon: Compass, label: "Hướng nhà", value: "Đông Nam" },
    { icon: FileText, label: "Pháp lý", value: "Sổ đỏ" },
    { icon: Sofa, label: "Nội thất", value: "Đầy đủ" },
    { icon: Ruler, label: "Mặt tiền", value: "5m" },
  ];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/nha-dat-ban" className="text-muted-foreground hover:text-primary">
              Nhà đất bán
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium line-clamp-1">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Slider */}
              <ImageSlider images={propertyImages} alt={property.title} />

              {/* Title & Price */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">
                    {property.title}
                  </h1>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-2xl md:text-3xl text-price">{property.price}</span>
                  {property.pricePerM2 && (
                    <span className="text-muted-foreground">{property.pricePerM2}</span>
                  )}
                </div>

                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary" />
                  {property.address}
                </p>

                <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Đăng ngày: {property.postedDate}
                </div>
              </div>

              {/* Specifications */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Thông tin chi tiết</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <spec.icon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-sm">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Mô tả chi tiết</h2>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  <p>
                    Căn nhà mặt phố vị trí đắc địa tại {property.address}, thuận tiện kinh doanh buôn bán.
                    Diện tích sử dụng rộng rãi {property.area}, thiết kế hiện đại với {property.bedrooms} phòng ngủ
                    và {property.bathrooms} phòng tắm khép kín.
                  </p>
                  <p className="mt-4">
                    <strong>Đặc điểm nổi bật:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Vị trí mặt tiền đường lớn, thuận tiện đi lại</li>
                    <li>Thiết kế hiện đại, thoáng mát, đón ánh sáng tự nhiên</li>
                    <li>Nội thất cao cấp, tiện nghi đầy đủ</li>
                    <li>Sổ đỏ chính chủ, pháp lý rõ ràng</li>
                    <li>Gần trường học, bệnh viện, siêu thị</li>
                    <li>An ninh tốt, cộng đồng dân cư văn minh</li>
                  </ul>
                  <p className="mt-4">
                    Liên hệ ngay để được tư vấn và xem nhà trực tiếp. Hỗ trợ vay ngân hàng lãi suất ưu đãi.
                  </p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Vị trí trên bản đồ</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Bản đồ sẽ hiển thị tại đây</p>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-card rounded-xl p-6 shadow-card sticky top-20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Nguyễn Văn A</h3>
                    <p className="text-muted-foreground text-sm">Môi giới chuyên nghiệp</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">5.0</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-5 h-5" />
                    0912 345 678
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="w-5 h-5" />
                    Nhắn tin Zalo
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-accent rounded-lg">
                  <p className="text-sm text-accent-foreground">
                    <span className="font-semibold">Lưu ý:</span> Không gửi tiền đặt cọc trước khi xem nhà.
                    Hãy xác minh thông tin kỹ lưỡng trước khi giao dịch.
                  </p>
                </div>
              </div>

              {/* Report */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Báo cáo tin đăng không chính xác
                </button>
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          <div className="mt-12">
            <h2 className="section-title">Tin tương tự</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {mockProperties.slice(0, 4).map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
