import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '@/config';

export type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    metal?: string;
    diamond?: string;
    size?: string;
    stone?: string;
    quantity?: number;
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
    // Initialize from LocalStorage if available
    const [cartItems, setCartItems] = useState<Product[]>(() => {
        const local = localStorage.getItem("cartItems");
        return local ? JSON.parse(local) : [];
    });
    const [wishlistItems, setWishlistItems] = useState<Product[]>(() => {
        const local = localStorage.getItem("wishlistItems");
        return local ? JSON.parse(local) : [];
    });

    const { user } = useAuth();

    // Persist to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // SYNC LOGIC: When User logs in, merge Local + Server
    useEffect(() => {
        if (user) {
            syncWithServer(user);
        }
    }, [user]); // Runs when user logs in

    const syncWithServer = async (userData: any) => {
        const serverCart = userData.cart || [];
        const serverWishlist = userData.wishlist || [];

        // Simple Merge Strategy: Combined list, deduplicated by ID
        // Priority: Local items (latest session) + Server items

        const mergedCart = [...cartItems];
        serverCart.forEach((sItem: Product) => {
            if (!mergedCart.find(lItem => lItem.id === sItem.id)) {
                mergedCart.push(sItem);
            }
        });

        const mergedWishlist = [...wishlistItems];
        serverWishlist.forEach((sItem: Product) => {
            if (!mergedWishlist.find(lItem => lItem.id === sItem.id)) {
                mergedWishlist.push(sItem);
            }
        });

        // Update State
        setCartItems(mergedCart);
        setWishlistItems(mergedWishlist);

        // Update Server with the merged result
        await updateServerData(mergedCart, mergedWishlist);
    };

    const updateServerData = async (cart: Product[], wishlist: Product[]) => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            await fetch(`${API_BASE_URL}/api/v1/auth/update-data`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ cart, wishlist })
            });
        } catch (error) {
            console.error("Failed to sync with server", error);
        }
    };

    const addToCart = (product: Product) => {
        // Check duplication
        const exists = cartItems.find((item) => item.id === product.id);
        if (exists) {
            toast.info("Item already in cart");
            return;
        }

        const newCart = [...cartItems, { ...product, quantity: 1 }];
        setCartItems(newCart);
        toast.success("Added to Cart", {
            description: `${product.name} has been added to your cart.`
        });

        if (user) updateServerData(newCart, wishlistItems);
    };

    const removeFromCart = (id: string) => {
        const newCart = cartItems.filter((item) => item.id !== id);
        setCartItems(newCart);
        toast.info("Removed from Cart");

        if (user) updateServerData(newCart, wishlistItems);
    };

    const addToWishlist = (product: Product) => {
        if (wishlistItems.find((item) => item.id === product.id)) return;

        const newWishlist = [...wishlistItems, product];
        setWishlistItems(newWishlist);
        toast.success("Added to Wishlist");

        if (user) updateServerData(cartItems, newWishlist);
    };

    const removeFromWishlist = (id: string) => {
        const newWishlist = wishlistItems.filter((item) => item.id !== id);
        setWishlistItems(newWishlist);
        toast.info("Removed from Wishlist");

        if (user) updateServerData(cartItems, newWishlist);
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
