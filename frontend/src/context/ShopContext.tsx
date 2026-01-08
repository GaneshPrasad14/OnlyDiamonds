import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    metal?: string;
    diamond?: string;
    size?: string;
    stone?: string;
};

interface ShopContextType {
    cartItems: Product[];
    wishlistItems: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

    const addToCart = (product: Product) => {
        setCartItems((prev) => [...prev, product]);
        toast.success("Added to Cart", {
            description: `${product.name} has been added to your cart.`
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        toast.info("Removed from Cart");
    };

    const addToWishlist = (product: Product) => {
        setWishlistItems((prev) => {
            if (prev.find((item) => item.id === product.id)) return prev;
            toast.success("Added to Wishlist");
            return [...prev, product];
        });
    };

    const removeFromWishlist = (id: string) => {
        setWishlistItems((prev) => prev.filter((item) => item.id !== id));
        toast.info("Removed from Wishlist");
    };

    return (
        <ShopContext.Provider value={{ cartItems, wishlistItems, addToCart, removeFromCart, addToWishlist, removeFromWishlist }}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
