import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Gửi thành công!",
      description: "Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container-custom py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              Trang chủ
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Liên hệ</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="gradient-hero py-12 md:py-16">
        <div className="container-custom text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ ngay để được tư vấn miễn phí.
          </p>
        </div>
      </section>

      <div className="bg-background">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-6">Thông tin liên hệ</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Địa chỉ</h3>
                      <p className="text-muted-foreground text-sm">
                        Tầng 31, Keangnam Hanoi Landmark Tower,
                        <br />
                        Phạm Hùng, Nam Từ Liêm, Hà Nội
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Hotline</h3>
                      <p className="text-muted-foreground text-sm">
                        <a href="tel:19001234" className="hover:text-primary">1900 1234</a>
                        <br />
                        <a href="tel:02435678910" className="hover:text-primary">024 3567 8910</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground text-sm">
                        <a href="mailto:hotro@nhadat.vn" className="hover:text-primary">hotro@nhadat.vn</a>
                        <br />
                        <a href="mailto:info@nhadat.vn" className="hover:text-primary">info@nhadat.vn</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Giờ làm việc</h3>
                      <p className="text-muted-foreground text-sm">
                        Thứ 2 - Thứ 6: 8:00 - 17:30
                        <br />
                        Thứ 7: 8:00 - 12:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Support */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h2 className="font-bold text-lg mb-4">Hỗ trợ nhanh</h2>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="w-5 h-5" />
                    Gọi ngay 1900 1234
                  </Button>
                  <Button variant="outline" className="w-full" size="lg">
                    <MessageCircle className="w-5 h-5" />
                    Chat Zalo
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl p-6 md:p-8 shadow-card">
                <h2 className="font-bold text-xl mb-6">Gửi tin nhắn cho chúng tôi</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Họ và tên <span className="text-primary">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-search"
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Số điện thoại <span className="text-primary">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-search"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-search"
                        placeholder="Nhập email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Chủ đề
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-search"
                      >
                        <option value="">Chọn chủ đề</option>
                        <option value="mua-ban">Hỗ trợ mua bán</option>
                        <option value="dang-tin">Hỗ trợ đăng tin</option>
                        <option value="khieu-nai">Khiếu nại</option>
                        <option value="hop-tac">Hợp tác kinh doanh</option>
                        <option value="khac">Khác</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nội dung tin nhắn <span className="text-primary">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-search resize-none"
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    <Send className="w-5 h-5" />
                    Gửi tin nhắn
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="mt-12">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <h2 className="font-bold text-lg mb-4">Bản đồ</h2>
              <div className="aspect-[21/9] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Google Map sẽ hiển thị tại đây</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
