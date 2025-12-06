import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight, Building2, Home, MapPin, TrendingUp } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { NewsCard } from "@/components/NewsCard";
import { AreaCard } from "@/components/AreaCard";
import { Button } from "@/components/ui/button";
import { mockProperties, mockNews, mockAreas } from "@/data/mockData";
import { cn } from "@/lib/utils";

const QUICK_DISTRICTS = [
  { label: "Thanh Xuân", value: "thanh-xuan" },
  { label: "Đống Đa", value: "dong-da" },
  { label: "Cầu Giấy", value: "cau-giay" },
  { label: "Ba Đình", value: "ba-dinh" },
  { label: "Hà Đông", value: "ha-dong" },
  { label: "Hai Bà Trưng", value: "hai-ba-trung" },
];

const CATEGORY_TABS = [
  { label: "Nhà đất bán", value: "nha-dat-ban", path: "/nha-dat-ban", icon: Home },
  { label: "Cho thuê", value: "cho-thue", path: "/cho-thue", icon: Building2 },
  { label: "Dự án", value: "du-an", path: "/du-an", icon: TrendingUp },
];

export default function Index() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("nha-dat-ban");

  const handleDistrictClick = (district: string) => {
    const currentTab = CATEGORY_TABS.find((tab) => tab.value === activeCategory);
    navigate(`${currentTab?.path || "/nha-dat-ban"}?district=${district}`);
  };

  const handleCategoryClick = (category: typeof CATEGORY_TABS[0]) => {
    setActiveCategory(category.value);
    navigate(category.path);
  };

  const handleSearch = () => {
    const currentTab = CATEGORY_TABS.find((tab) => tab.value === activeCategory);
    navigate(currentTab?.path || "/nha-dat-ban");
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
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-1">
                {CATEGORY_TABS.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => handleCategoryClick(tab)}
                      className={cn(
                        "filter-chip whitespace-nowrap transition-colors flex items-center gap-1.5",
                        activeCategory === tab.value && "active"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Input */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nhập địa điểm, quận/huyện, phường/xã..."
                    className="input-search pl-10"
                  />
                </div>
                <Button size="lg" className="md:w-auto" onClick={handleSearch}>
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
            {mockProperties.slice(0, 8).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
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
