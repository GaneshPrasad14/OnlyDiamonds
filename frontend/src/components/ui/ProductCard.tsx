import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  goldType: string;
  diamondWeight: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  goldType,
  diamondWeight,
  isNew,
  isBestseller,
}: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-luxury transition-all duration-500 hover-lift">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {isNew && (
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            New
          </span>
        )}
        {isBestseller && (
          <span className="px-3 py-1 bg-accent text-brown-dark text-xs font-medium rounded-full">
            Bestseller
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent hover:text-brown-dark">
        <Heart className="h-5 w-5" />
      </button>

      {/* Image */}
      <Link to={`/product/${id}`} className="block image-zoom aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/product/${id}`}>
          <h3 className="font-serif text-lg font-medium text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span>{goldType}</span>
          <span className="w-1 h-1 rounded-full bg-accent" />
          <span>{diamondWeight}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-serif text-xl font-bold text-primary font-price">{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through font-price">{originalPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};
