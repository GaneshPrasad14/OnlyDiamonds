import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { ProductCard } from "@/components/ui/ProductCard";
import { ArrowRight, Shield, Award, Gem, RefreshCw, Star } from "lucide-react";
import GoogleReviews from "@/components/ui/GoogleReviews";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import HeroSlider from "@/components/ui/HeroSlider";
import StatsSection from "@/components/ui/StatsSection";
import CategoryShowcase from "@/components/ui/CategoryShowcase";
import NewArrivals from "@/components/ui/NewArrivals";
import WhyOnlyDiamonds from "@/components/ui/WhyOnlyDiamonds";
import { API_BASE_URL } from "@/config";





const trustBadges = [
  {
    icon: Award,
    title: "37+ Years Legacy",
    description: "Trusted diamond expertise since 1988",
  },
  {
    icon: Shield,
    title: "SGL / IGI Certified",
    description: "Every diamond authentically certified",
  },
  {
    icon: Gem,
    title: "BIS Hallmark",
    description: "Guaranteed purity with HUID",
  },
  {
    icon: RefreshCw,
    title: "Lifetime Exchange",
    description: "Best value on all exchanges",
  },
];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "The craftsmanship is absolutely stunning. My engagement ring from Only Diamonds is everything I dreamed of.",
    rating: 5,
  },
  {
    name: "Anita Patel",
    location: "Bangalore",
    text: "From selection to delivery, the experience was flawless. The diamond necklace exceeded my expectations.",
    rating: 5,
  },
  {
    name: "Meera Krishnan",
    location: "Chennai",
    text: "Three generations of my family have trusted Only Diamonds. The quality speaks for itself.",
    rating: 5,
  },
];

const Index = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();

        const topLevel = data.filter((cat: any) => !cat.parent);
        const mappedCategories = topLevel.map((cat: any) => ({
          name: cat.name,
          image: cat.image.startsWith('uploads') ? `${API_BASE_URL}/${cat.image}` : `${API_BASE_URL}/uploads/${cat.image}`,
          href: `/shop?category=${cat.name}`,
          description: cat.description || "Discover our collection"
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products`);
        const data = await response.json();
        // Basic mapping if needed, or just use data directly if mapped in render
        // We might want to filter for 'bestsellers' later, for now just take latest
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSlider />

      {/* Stats Section */}
      <StatsSection />

      {/* Categories Section */}
      <section className="py-24 bg-gradient-to-b from-cream to-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              Explore Our Collections
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
              Curated Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From everyday elegance to extraordinary celebrations, discover diamonds
              crafted for every moment.
            </p>
          </div>

          <div className="relative px-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {categories.map((category, index) => (
                  <CarouselItem key={category.name} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <CategoryCard
                      {...category}
                      className="animate-fade-in opacity-0 h-[400px]"
                      style={{ animationDelay: `${index * 0.1}s` } as React.CSSProperties}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </section>

      {/* Category Showcase - Rings */}
      <CategoryShowcase categoryName="Rings" title="Rings that fit right into your routine" subtitle="Explore our exclusive range of diamond rings." />

      {/* Bestsellers Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
                Customer Favorites
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                Bestsellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all duration-300 mt-4 md:mt-0"
            >
              View All Collections
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => {
              const diamondWt = product.diamondDetails?.reduce((acc: number, cur: any) => acc + (cur.weight * cur.count), 0) || 0;
              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  image={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${API_BASE_URL}/${product.images[0].replace(/^uploads[\\/]/, 'uploads/')}`) : (product.image ? (product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image.replace(/^uploads[\\/]/, 'uploads/')}`) : "")}
                  price={`₹${Math.round((product.priceBreakup?.grandTotal > 0) ? product.priceBreakup.grandTotal : product.price).toLocaleString()}`}
                  goldType={product.goldDetails?.metalPurity ? `${product.goldDetails.metalPurity} Gold` : "22KT Gold"}
                  diamondWeight={diamondWt > 0 ? `${diamondWt.toFixed(2)} Carat` : ""}
                  isNew={product.isNew}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Current Offers / New Arrivals */}
      {/* Current Offers / New Arrivals */}
      <NewArrivals />

      {/* Why Only Diamonds Section */}
      <WhyOnlyDiamonds />

      {/* Heritage Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 border border-cream rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] border border-cream rounded-full translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              Why Choose Us
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-cream-light mb-4">
              A Legacy of Trust
            </h2>
            <p className="text-cream-light/70 max-w-2xl mx-auto">
              For over three decades, Only Diamonds has been the trusted name in
              fine diamond jewellery, combining traditional craftsmanship with modern elegance.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {trustBadges.map((badge, index) => (
              <div
                key={badge.title}
                className="text-center p-6 lg:p-8 rounded-2xl bg-cream-light/5 backdrop-blur-sm border border-cream-light/10 hover:bg-cream-light/10 transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
                  <badge.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-cream-light mb-2">
                  {badge.title}
                </h3>
                <p className="text-cream-light/60 text-sm">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-background to-cream">
        <GoogleReviews />
      </section>


    </main >
  );
};

export default Index;
