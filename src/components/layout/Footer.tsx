import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Youtube, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-foreground flex items-center justify-center">
                <span className="text-primary font-bold text-lg">BĐS</span>
              </div>
              <div>
                <span className="font-bold text-lg">NhàĐất</span>
                <span className="text-primary font-bold text-lg">.vn</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              Website bất động sản hàng đầu Việt Nam. Cung cấp thông tin mua bán, cho thuê nhà đất uy tín, chính xác.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-primary-foreground/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Danh mục</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/nha-dat-ban" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Nhà đất bán
                </Link>
              </li>
              <li>
                <Link to="/cho-thue" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Nhà đất cho thuê
                </Link>
              </li>
              <li>
                <Link to="/du-an" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Dự án
                </Link>
              </li>
              <li>
                <Link to="/tin-tuc" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Tin tức
                </Link>
              </li>
              <li>
                <Link to="/lien-he" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Hướng dẫn đăng tin
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Quy chế hoạt động
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Điều khoản thỏa thuận
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  Giải quyết khiếu nại
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  Tầng 31, Keangnam Hanoi Landmark Tower, Phạm Hùng, Nam Từ Liêm, Hà Nội
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <a href="tel:19001234" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  1900 1234
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <a href="mailto:hotro@nhadat.vn" className="text-primary-foreground/70 hover:text-primary transition-colors text-sm">
                  hotro@nhadat.vn
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm text-center md:text-left">
              © 2024 NhàĐất.vn. Bản quyền thuộc về Công ty Cổ phần Bất động sản Việt Nam.
            </p>
            <div className="flex items-center gap-4">
              <img src="https://placehold.co/80x30/2d2d2d/ffffff?text=BCT" alt="Bộ Công Thương" className="h-8 opacity-60" />
              <img src="https://placehold.co/80x30/2d2d2d/ffffff?text=DMCA" alt="DMCA" className="h-8 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
