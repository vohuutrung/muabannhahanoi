import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard, Property } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper to format price
function formatPrice(price: number): string {
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1).replace(/\.0$/, '')} tỷ`;
  }
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`;
  }
  return `${price.toLocaleString('vi-VN')} đ`;
}

// Helper to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hôm nay";
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  return `${Math.floor(diffDays / 30)} tháng trước`;
}

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();

  const { data: favoriteProperties = [], isLoading } = useQuery({
    queryKey: ["favoriteProperties", favorites],
    queryFn: async () => {
      if (favorites.length === 0) return [];

      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .in("id", favorites);

      if (error) {
        console.error("Error fetching favorite properties:", error);
        return [];
      }

      // Transform Supabase data to Property format
      return (data || []).map((item): Property => {
        // Normalize vip_type to uppercase to match PropertyCard expectations
        const normalizedVipType = item.vip_type?.toUpperCase() as "KIMCUONG" | "VANG" | "BAC" | null;
        
        return {
          id: item.id,
          title: item.title,
          price: formatPrice(item.price),
          pricePerM2: item.area > 0 ? `~${formatPrice(Math.round(item.price / item.area))}/m²` : undefined,
          area: `${item.area} m²`,
          address: [item.street, item.ward, item.district, item.city].filter(Boolean).join(", "),
          bedrooms: item.bedrooms ?? undefined,
          bathrooms: item.bathrooms ?? undefined,
          floors: item.floors ?? undefined,
          image: item.images?.[0] ?? undefined,
          images: item.images ?? undefined,
          postedDate: formatDate(item.created_at),
          vipType: normalizedVipType,
          district: item.district,
          description: item.description ?? undefined,
        };
      });
    },
    enabled: favorites.length > 0,
  });

  return (
    <Layout>
      <div className="bg-secondary py-6">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-primary">
              Trang chủ
            </Link>
            <span>/</span>
            <span className="text-foreground">Tin đã lưu</span>
          </div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-7 h-7 text-primary" />
              Tin đã lưu
            </h1>
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Chưa có tin nào được lưu
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Nhấn vào biểu tượng trái tim trên các tin đăng để lưu lại và xem sau.
            </p>
            <Button asChild>
              <Link to="/nha-dat-ban">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Khám phá nhà đất
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground mb-6">
              Bạn đã lưu <strong className="text-foreground">{favorites.length}</strong> tin đăng
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {favoriteProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
