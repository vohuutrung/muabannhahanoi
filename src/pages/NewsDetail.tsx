import { Link, useParams } from "react-router-dom";
import { Calendar, User, Share2, Facebook, Twitter, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { NewsCard } from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { mockNews } from "@/data/mockData";

export default function NewsDetail() {
  const { id } = useParams();
  const news = mockNews.find((n) => n.id === id) || mockNews[0];

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
            <Link to="/tin-tuc" className="text-muted-foreground hover:text-primary">
              Tin tức
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium line-clamp-1">{news.title}</span>
          </div>
        </div>
      </div>

      <div className="bg-background">
        <div className="container-custom py-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded mb-4">
                {news.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Admin
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {news.date}
                </span>
              </div>
            </div>

            {/* Featured Image */}
            <div className="aspect-video rounded-xl overflow-hidden mb-8">
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                {news.excerpt}
              </p>

              <h2>Tổng quan thị trường</h2>
              <p>
                Trong năm 2024, thị trường bất động sản Việt Nam đã chứng kiến nhiều biến động đáng chú ý. 
                Sự phục hồi kinh tế sau đại dịch, cùng với các chính sách hỗ trợ từ Chính phủ, đã tạo động lực 
                tích cực cho ngành bất động sản.
              </p>

              <p>
                Theo số liệu thống kê, lượng giao dịch bất động sản trong quý III/2024 tăng 25% so với cùng kỳ 
                năm trước. Đặc biệt, phân khúc nhà ở vừa túi tiền và căn hộ chung cư tiếp tục dẫn đầu về 
                mức độ quan tâm của người mua.
              </p>

              <h2>Xu hướng nổi bật</h2>
              <ul>
                <li>
                  <strong>Bất động sản xanh:</strong> Các dự án thân thiện với môi trường ngày càng được 
                  ưa chuộng, đặc biệt trong phân khúc cao cấp.
                </li>
                <li>
                  <strong>Smart home:</strong> Xu hướng tích hợp công nghệ thông minh vào căn hộ tiếp tục 
                  phát triển mạnh mẽ.
                </li>
                <li>
                  <strong>Đô thị vệ tinh:</strong> Sự phát triển của các đô thị vệ tinh xung quanh các 
                  thành phố lớn thu hút nhiều nhà đầu tư.
                </li>
              </ul>

              <h2>Dự báo năm 2025</h2>
              <p>
                Các chuyên gia nhận định thị trường bất động sản sẽ tiếp tục ổn định và có xu hướng 
                tăng trưởng trong năm 2025. Lãi suất cho vay mua nhà duy trì ở mức thấp, cùng với nhu cầu 
                nhà ở thực vẫn rất lớn, là những yếu tố hỗ trợ tích cực cho thị trường.
              </p>

              <blockquote>
                "Năm 2025 sẽ là năm của sự phục hồi mạnh mẽ. Chúng tôi kỳ vọng lượng giao dịch sẽ 
                tăng 30-40% so với năm 2024." - Chuyên gia BĐS
              </blockquote>
            </article>

            {/* Share */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border">
              <span className="text-foreground font-medium">Chia sẻ:</span>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-12">
            <h2 className="section-title">Bài viết liên quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockNews.slice(1, 4).map((n) => (
                <NewsCard key={n.id} news={n} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
