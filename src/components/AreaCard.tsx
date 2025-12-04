import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface Area {
  id: string;
  name: string;
  propertyCount: number;
  image: string;
}

interface AreaCardProps {
  area: Area;
}

export function AreaCard({ area }: AreaCardProps) {
  return (
    <Link
      to={`/nha-dat-ban?area=${area.id}`}
      className="property-card group relative overflow-hidden rounded-xl aspect-[4/3]"
    >
      <img
        src={area.image}
        alt={area.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-bold text-lg text-primary-foreground mb-1">{area.name}</h3>
        <p className="text-primary-foreground/80 text-sm flex items-center gap-1 group-hover:text-primary transition-colors">
          {area.propertyCount.toLocaleString()} tin đăng
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </p>
      </div>
    </Link>
  );
}
