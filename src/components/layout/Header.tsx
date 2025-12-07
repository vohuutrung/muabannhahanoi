import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Phone, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

const navLinks = [
  { label: "Nhà đất bán", href: "/nha-dat-ban" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* Logo mới */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/Logo.png"
              alt="Muabannhahanoi.vn"
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm nhà đất..."
                className="input-search pl-10"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === link.href ||
                    location.pathname.startsWith(link.href + "/")
                    ? "text-primary bg-accent"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3 ml-4">
            <Link
              to="/yeu-thich"
              className={cn(
                "relative p-2 rounded-lg transition-colors",
                location.pathname === "/yeu-thich"
                  ? "text-primary bg-accent"
                  : "text-foreground/80 hover:text-primary hover:bg-accent"
              )}
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {favorites.length > 9 ? "9+" : favorites.length}
                </span>
              )}
            </Link>
            <Button variant="outline" size="sm">
              <Phone className="w-4 h-4" />
              Hotline
            </Button>
            <Button size="sm">Đăng tin</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm nhà đất..."
              className="input-search pl-10"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-fade-in">
          <nav className="container-custom py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary bg-accent"
                    : "text-foreground/80 hover:text-primary hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}

            <Link
              to="/yeu-thich"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === "/yeu-thich"
                  ? "text-primary bg-accent"
                  : "text-foreground/80 hover:text-primary hover:bg-accent"
              )}
            >
              <Heart className="w-5 h-5" />
              Tin đã lưu
              {favorites.length > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1">
                <Phone className="w-4 h-4" />
                Hotline
              </Button>
              <Button className="flex-1">Đăng tin</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
