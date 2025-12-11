import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Home } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard, Property } from "@/components/PropertyCard";
import { NewsCard } from "@/components/NewsCard";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { SearchAutocomplete } from "@/components/SearchAutocomplete";
import { mockNews, mockAreas } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

const QUICK_DISTRICTS = [
  { label: "Thanh Xuân", value: "thanh-xuan" },
  { label: "Đống Đa", value: "dong-da" },
  { label: "Cầu Giấy", value: "cau-giay" },
  { label: "Ba Đình", value: "ba-dinh" },
  { label: "Hà Đông", value: "ha-dong" },
  { label: "Hai Bà Trưng", value: "hai-ba-trung" },
];

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts_public")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error) {
        console.error("Error fetching posts:", error);
        return;
      }

      // Map posts to Property type for PropertyCard compatibility
      const mappedPosts: Property[] = (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        price: formatPrice(post.price),
        pricePerM2: post.area > 0 ? `${formatPrice(post.price / post.area)}/m²` : undefined,
        area: `${post.area} m²`,
        address: [post.street, post.ward, post.district, post.city].filter(Boolean).join(", "),
        bedrooms: post.bedrooms || undefined,
        bathrooms: post.bathrooms || undefined,
        floors: post.floors || undefined,
        image: post.images?.[0] || "/placeholder.svg",
        images: post.images || [],
        postedDate: formatDate(post.created_at),
        vipType: post.listing_type === "kimcuong" ? "KIMCUONG" : 
                 post.listing_type === "vang" ? "VANG" : 
                 post.listing_type === "bac" ? "BAC" : null,
        district: post.district,
        description: post.description || undefined,
      }));

      setPosts(mappedPosts);
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

  const handleDistrictClick = (district: string) => {
    navigate(`/nha-dat-ban?district=${district}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/nha-dat-ban?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleAutocompleteSelect = (type: "district" | "propertyType", value: string) => {
    if (type === "district") {
      navigate(`/nha-dat-ban?district=${value}`);
    } else {
      navigate(`/nha-dat-ban?propertyType=${value}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-20">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4 animate-fade-in">
              Tìm kiếm nhà đất
              <br />
              <span className="text-primary-foreground/90">dễ dàng & nhanh chóng</span>
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg mb-8 animate-fade-in">
              Hơn 50,000 tin đăng mới mỗi tháng. Kết nối trực tiếp với chủ nhà.
            </p>

            {/* Search Box */}
            <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg animate-slide-up">
              {/* Category Label */}
              <div className="flex items-center gap-2 mb-4">
                <span className="filter-chip active flex items-center gap-1.5">
                  <Home className="w-4 h-4" />
                  Nhà đất bán
                </span>
              </div>

              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-3">
                <SearchAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleAutocompleteSelect}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập địa điểm, quận/huyện, loại nhà..."
                />
                <Button 
                  size="lg" 
                  className="md:w-auto" 
                  onClick={handleSearch}
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </Button>
              </div>

              {/* Quick District Search */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Tìm nhanh:</span>
                <div className="flex gap-2">
                  {QUICK_DISTRICTS.map((district) => (
                    <button
                      key={district.value}
                      onClick={() => handleDistrictClick(district.value)}
                      className="filter-chip whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      {district.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Tin đăng", value: "50K+" },
                { label: "Người dùng", value: "1M+" },
                { label: "Dự án", value: "500+" },
                { label: "Khu vực", value: "63" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-primary-foreground">{stat.value}</p>
                  <p className="text-primary-foreground/70 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Tin đăng mới nhất</h2>
            <Link
              to="/nha-dat-ban"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Đang tải...
              </div>
            ) : posts.length > 0 ? (
              posts.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Chưa có tin đăng nào
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Areas Section */}
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Khu vực nổi bật</h2>
            <Link
              to="/nha-dat-ban"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockAreas.map((area) => (
              <AreaCard key={area.id} area={area} />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title mb-0">Tin tức bất động sản</h2>
            <Link
              to="/tin-tuc"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:underline"
            >
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <NewsCard news={mockNews[0]} variant="featured" />
            </div>
            {mockNews.slice(1, 5).map((news) => (
              <NewsCard key={news.id} news={news} variant="horizontal" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 gradient-hero">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Bạn muốn đăng tin bất động sản?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Đăng tin miễn phí, tiếp cận hàng triệu người mua tiềm năng trên cả nước.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Đăng tin ngay
            </Button>
            <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
