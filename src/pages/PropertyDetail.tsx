import { Link, useParams } from "react-router-dom";
import { 
  MapPin, BedDouble, Bath, Layers, Compass, FileText, Sofa, 
  Calendar, Share2, Heart, Phone, MessageCircle, ChevronRight,
  Building2, Ruler, ArrowUpDown, Home
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ImageSlider } from "@/components/ImageSlider";
import { PropertyCardNew } from "@/components/PropertyCardNew";
import { Button } from "@/components/ui/button";
import { mockProperties } from "@/data/properties";
import { HANOI_DISTRICTS } from "@/types/property";
import { Helmet } from "react-helmet-async";

export default function PropertyDetail() {
  const { slug } = useParams();
  
  // Find property by slug
  const property = mockProperties.find((p) => p.slug === slug) || mockProperties[0];
  
  // Get district label
  const districtLabel = HANOI_DISTRICTS.find((d) => d.value === property.district)?.label || property.district;

  // Get similar properties (same district or property type)
  const similarProperties = mockProperties
    .filter((p) => p.id !== property.id && (p.district === property.district || p.propertyType === property.propertyType))
    .slice(0, 4);

  const specs = [
    { icon: Layers, label: "Diện tích", value: property.area },
    { icon: BedDouble, label: "Phòng ngủ", value: property.bedrooms ? `${property.bedrooms} phòng` : "—" },
    { icon: Bath, label: "Phòng tắm", value: property.bathrooms ? `${property.bathrooms} phòng` : "—" },
    { icon: ArrowUpDown, label: "Số tầng", value: property.floors ? `${property.floors} tầng` : "—" },
    { icon: Compass, label: "Hướng nhà", value: property.direction || "—" },
    { icon: Compass, label: "Hướng ban công", value: property.balconyDirection || "—" },
    { icon: FileText, label: "Pháp lý", value: property.legalStatus },
    { icon: Sofa, label: "Nội thất", value: property.interior },
  ];

  // Property type mapping
  const propertyTypeLabels: Record<string, string> = {
    "nha-rieng": "Nhà riêng",
    "nha-mat-pho": "Nhà mặt phố",
    "can-ho": "Căn hộ chung cư",
    "biet-thu": "Biệt thự",
    "dat-nen": "Đất nền",
    "shophouse": "Shophouse",
  };

  return (
    <Layout>
      <Helmet>
        <title>{property.title} | BatDongSan</title>
        <meta 
          name="description" 
          content={`${property.title}. Giá ${property.price}, diện tích ${property.area}. ${property.address}. Liên hệ ngay: ${property.contact.phone}`} 
        />
        <link rel="canonical" href={`/nha-dat-ban/${property.slug}`} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/nha-dat-ban" className="text-muted-foreground hover:text-primary transition-colors">
              Nhà đất bán
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to={`/nha-dat-ban?district=${property.district}`} className="text-muted-foreground hover:text-primary transition-colors">
              {districtLabel}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium line-clamp-1 max-w-[200px]">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container-custom py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Slider */}
              <ImageSlider images={property.images} alt={property.title} />

              {/* Title & Price */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    {(property.isHot || property.isVip) && (
                      <div className="flex gap-2 mb-2">
                        {property.isHot && <span className="badge-hot">HOT</span>}
                        {property.isVip && <span className="badge-vip">VIP</span>}
                      </div>
                    )}
                    <h1 className="text-xl md:text-2xl font-bold text-foreground">
                      {property.title}
                    </h1>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" aria-label="Chia sẻ">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Lưu tin">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <span className="text-2xl md:text-3xl text-price">{property.price}</span>
                  {property.pricePerM2 && (
                    <span className="text-muted-foreground text-lg">{property.pricePerM2}</span>
                  )}
                </div>

                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  {property.address}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    {propertyTypeLabels[property.propertyType] || property.propertyType}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Đăng ngày: {property.postedDate}
                  </span>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Thông tin chi tiết</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                      <spec.icon className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{spec.label}</p>
                        <p className="font-medium text-sm truncate">{spec.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Mô tả chi tiết</h2>
                <div className="prose prose-sm max-w-none text-foreground/80">
                  <p className="whitespace-pre-line">{property.description}</p>
                  <p className="mt-4">
                    <strong>Đặc điểm nổi bật:</strong>
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Vị trí đẹp tại {property.ward}, {districtLabel}</li>
                    <li>Diện tích sử dụng: {property.area}</li>
                    {property.bedrooms && <li>{property.bedrooms} phòng ngủ rộng rãi</li>}
                    {property.bathrooms && <li>{property.bathrooms} phòng tắm khép kín</li>}
                    {property.direction && <li>Hướng {property.direction}, thoáng mát</li>}
                    <li>Pháp lý: {property.legalStatus}</li>
                    <li>Nội thất: {property.interior}</li>
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
                    <h3 className="font-bold text-lg">{property.contact.name}</h3>
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
                    {property.contact.phone}
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
          {similarProperties.length > 0 && (
            <div className="mt-12">
              <h2 className="section-title">Tin tương tự</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {similarProperties.map((p) => (
                  <PropertyCardNew key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
