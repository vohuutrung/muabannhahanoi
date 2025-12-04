import { Link } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="container-custom">
          <div className="max-w-lg mx-auto text-center">
            <div className="relative mb-8">
              <span className="text-[150px] md:text-[200px] font-bold text-muted/50 leading-none">
                404
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full gradient-hero flex items-center justify-center">
                  <Search className="w-10 h-10 text-primary-foreground" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Không tìm thấy trang
            </h1>
            <p className="text-muted-foreground mb-8">
              Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Về trang chủ
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-5 h-5" />
                Quay lại
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
