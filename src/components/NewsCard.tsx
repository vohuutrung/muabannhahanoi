import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
}

interface NewsCardProps {
  news: NewsItem;
  variant?: "vertical" | "horizontal" | "featured";
}

export function NewsCard({ news, variant = "vertical" }: NewsCardProps) {
  if (variant === "featured") {
    return (
      <Link to={`/tin-tuc/${news.id}`} className="property-card group block">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 gradient-overlay" />
          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded mb-2">
              {news.category}
            </span>
            <h3 className="font-bold text-lg md:text-xl text-primary-foreground line-clamp-2 mb-2">
              {news.title}
            </h3>
            <p className="text-primary-foreground/80 text-sm line-clamp-2 hidden md:block">
              {news.excerpt}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link to={`/tin-tuc/${news.id}`} className="flex gap-4 group">
        <div className="relative w-24 h-20 sm:w-32 sm:h-24 shrink-0 rounded-lg overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-primary text-xs font-medium">{news.category}</span>
          <h3 className="font-semibold text-sm line-clamp-2 text-foreground group-hover:text-primary transition-colors mt-1">
            {news.title}
          </h3>
          <p className="text-muted-foreground text-xs flex items-center gap-1 mt-2">
            <Clock className="w-3 h-3" />
            {news.date}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/tin-tuc/${news.id}`} className="property-card group block">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <span className="text-primary text-xs font-medium">{news.category}</span>
        <h3 className="font-semibold text-base line-clamp-2 text-foreground group-hover:text-primary transition-colors mt-1 mb-2">
          {news.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {news.excerpt}
        </p>
        <p className="text-muted-foreground text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {news.date}
        </p>
      </div>
    </Link>
  );
}
