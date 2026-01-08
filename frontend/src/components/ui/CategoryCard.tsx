import { Link } from "react-router-dom";
import { ArrowRight, Gem } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  image: string;
  href: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CategoryCard = ({ name, image, href, description, className, style }: CategoryCardProps) => {
  return (
    <Link
      to={href}
      style={style}
      className={cn(
        "group relative block overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-luxury transition-all duration-500",
        className
      )}
    >
      {/* Image */}
      <div className="image-zoom aspect-[4/5]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 via-brown-dark/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-serif text-2xl font-semibold text-cream-light mb-2 group-hover:text-accent transition-colors">
          {name}
        </h3>
        {description && (
          <p className="text-cream-light/70 text-sm mb-4">{description}</p>
        )}
        <div className="flex items-center gap-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span>Explore Collection</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>

      {/* Sparkle Effect */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <Gem className="h-6 w-6 text-cream-light animate-sparkle" />
      </div>
    </Link>
  );
};
