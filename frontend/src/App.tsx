import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PublicLayout from "@/components/layout/PublicLayout";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Compare from "./pages/Compare";
import ProductDetail from "./pages/ProductDetail";
import Customize from "./pages/Customize";
import About from "./pages/About";
import MagicDiamonds from "./pages/MagicDiamonds";
import KnowDiamonds from "./pages/KnowDiamonds";
import Contact from "./pages/Contact";
import ExchangePolicy from "./pages/ExchangePolicy";
import NotFound from "./pages/NotFound";
import { ShopProvider } from "@/context/ShopContext";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ConstructionPopup from "./components/ui/ConstructionPopup";

// Admin Imports
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/AddProduct";
import ProductList from "./pages/admin/ProductList";
import CategoryManager from "./pages/admin/CategoryManager";
import AdminLogin from "./pages/admin/AdminLogin";
import HeroManager from "./pages/admin/HeroManager";
import DiamondPriceManager from "./pages/admin/DiamondPriceManager";
import ColorStoneManager from "./pages/admin/ColorStoneManager";
import TaxChargeManager from "./pages/admin/TaxChargeManager";
import UsersList from "./pages/admin/UsersList";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ConstructionPopup />
      <AuthProvider>
        <ShopProvider>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <Routes>
              {/* Public Routes - Wrapped in PublicLayout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/customize" element={<Customize />} />
                <Route path="/about" element={<About />} />
                <Route path="/magic-diamonds" element={<MagicDiamonds />} />
                <Route path="/know-diamonds" element={<KnowDiamonds />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/exchange-policy" element={<ExchangePolicy />} />
              </Route>

              {/* Admin Login - Standalone, no navbar */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Routes - Protected by AdminLayout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<UsersList />} />
                <Route path="products" element={<ProductList />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="diamond-prices" element={<DiamondPriceManager />} />
                <Route path="color-stones" element={<ColorStoneManager />} />
                <Route path="tax-charges" element={<TaxChargeManager />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:id" element={<AddProduct />} />
                <Route path="hero" element={<HeroManager />} />
              </Route>

              {/* 404 - Wrapped in PublicLayout so user acts normal */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ShopProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
