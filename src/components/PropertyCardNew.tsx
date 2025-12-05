import { Link } from "react-router-dom";
import { BedDouble, Bath, Layers, MapPin, Clock, Heart, Compass, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
  variant?: "vertical" | "horizontal";
}

export function PropertyCardNew({ property, variant = "vertical" }: PropertyCardProps) {
  const url = `/nha-ban/${property.district}/${property.slug}`;

  if (variant === "horizontal") {
    return (
      <Link to={url} className="property-card flex gap-4 p-3">
        <div className="relative w-32 h-24 sm:w-48 sm:h-32 shrink-0 rounded-lg overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {property.isHot && (
            <span className="badge-hot absolute top-2 left-2">HOT</span>
          )}
          {property.isVip && (
            <span className="badge-vip absolute top-2 left-2">VIP</span>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-foreground mb-2 hover:text-primary transition-colors">
            {property.title}
          </h3>
          <p className="text-price text-base sm:text-lg mb-1">
            {property.price}
            {property.pricePerM2 && (
              <span className="text-muted-foreground text-sm font-normal ml-2">
                {property.pricePerM2}
              </span>
            )}
          </p>
          <p className="text-muted-foreground text-xs sm:text-sm flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="line-clamp-1">{property.address}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3" /> {property.area}
            </span>
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3 h-3" /> {property.bedrooms} PN
              </span>
            )}
            {property.direction && (
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3" /> {property.direction}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {property.postedDate}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={url} className="property-card group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
        <button
          onClick={(e) => {
            e.preventDefault();
            // Handle favorite
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
          aria-label="Lưu tin"
        >
          <Heart className="w-4 h-4" />
        </button>
        {property.isHot && (
          <span className="badge-hot absolute top-3 left-3">HOT</span>
        )}
        {property.isVip && !property.isHot && (
          <span className="badge-vip absolute top-3 left-3">VIP</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-base line-clamp-2 text-foreground mb-2 group-hover:text-primary transition-colors min-h-[48px]">
          {property.title}
        </h3>
        <p className="text-price text-lg mb-1">{property.price}</p>
        {property.pricePerM2 && (
          <p className="text-muted-foreground text-sm mb-2">{property.pricePerM2}</p>
        )}
        <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span className="line-clamp-1">{property.address}</span>
        </p>
        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-3 text-muted-foreground text-sm">
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4" /> {property.area}
            </span>
            {property.bedrooms && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-4 h-4" /> {property.bedrooms}
              </span>
            )}
            {property.floors && (
              <span className="flex items-center gap-1">
                <ArrowUpDown className="w-4 h-4" /> {property.floors}T
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
          <Clock className="w-3 h-3" />
          <span>{property.postedDate}</span>
        </div>
      </div>
    </Link>
  );
}
