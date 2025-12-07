import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { mockProperties } from "@/data/mockData";

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();

  const favoriteProperties = mockProperties.filter((property) =>
    favorites.includes(property.id)
  );

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
        {favoriteProperties.length === 0 ? (
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
