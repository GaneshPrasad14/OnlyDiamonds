import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, X } from "lucide-react";

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist, addToCart } = useShop();

    return (
        <main className="pt-24 pb-16 min-h-screen bg-background font-serif">
            <div className="container mx-auto px-4 lg:px-8">
                <h1 className="text-3xl font-bold text-primary mb-8">My Wishlist ({wishlistItems.length})</h1>

                {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                        <Button variant="outline" asChild>
                            <Link to="/shop">Explore Collections</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item) => (
                            <div key={item.id} className="group relative bg-card rounded-xl overflow-hidden border border-border/50 hover:shadow-lg transition-all">
                                <div className="aspect-square bg-muted relative">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-primary truncate">{item.name}</h3>
                                    <p className="text-gold font-bold mb-3">{item.price}</p>
                                    <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() => {
                                            addToCart(item);
                                            removeFromWishlist(item.id);
                                        }}
                                    >
                                        Move to Cart
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Wishlist;
