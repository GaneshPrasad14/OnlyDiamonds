import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, Grid, List, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ui/ProductCard";
import { cn, getImageUrl } from "@/lib/utils";
import { API_BASE_URL } from "@/config";

import productRing1 from "@/assets/product-ring-1.jpg";
import productEarrings1 from "@/assets/product-earrings-1.jpg";
import productPendant1 from "@/assets/product-pendant-1.jpg";
import productNecklace1 from "@/assets/product-necklace-1.jpg";
import categoryStuds from "@/assets/category-studs.jpg";
import categoryBangles from "@/assets/category-bangles.jpg";
import categoryBracelets from "@/assets/category-bracelets.jpg";
import categoryMangalsutra from "@/assets/category-mangalsutra.jpg";

const categories = [
  "All",
  "Earrings",
  "Rings",
  "Bangles and Bracelet",
  "Solitaires",
  "Necklace",
];

const subcategories: Record<string, string[]> = {
  Earrings: ["Hoops", "Close setting studs", "Studs", "Earcuffs", "Drops", "Kids"],
  Rings: ["Ladies Ring", "Dailywear", "Vangi rings", "Engagement Rings", "band rings", "Cocktail rings", "Gents Rings"],
  "Bangles and Bracelet": ["Dailywear Bangles", "Close setting bangles", "Lock type bangles", "Kada Bangles", "Oval Bracelets", "Chain Bracelets", "Clutch Bracelets"],
  Solitaires: ["Solitaire Rings", "Solitaire Pendents", "Solitaire Chains", "Solitaire Necklaces", "Solitaire Bracelets", "Tennis Bracelets"],
  Necklace: ["Haram", "Oddiyanam"],
};

const filters = {
  goldType: ["18KT Yellow Gold", "18KT White Gold", "18KT Rose Gold", "22KT Gold"],
  diamondType: ["Natural Diamond", "Lab Grown Diamond"],
  priceRange: ["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,50,000", "Above ₹2,50,000"],
  occasion: ["Daily Wear", "Office Wear", "Party Wear", "Bridal", "Gifting"],
  availability: ["In Stock"],
};


const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSubcategory = searchParams.get("subcategory");

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>(initialSubcategory ? [initialSubcategory] : []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products`);
        const data = await response.json();

        // Map backend data to frontend structure if needed
        // Assuming backend returns array of objects similar to frontend structure
        const formattedProducts = data.map((p: any) => ({
          ...p,
          id: p._id, // Map MongoDB _id to id
          image: getImageUrl(p.image), // Handle image path
          originalPrice: p.price, // Just for fallback
          goldType: "18KT Yellow Gold", // Default or fetch if available
          diamondWeight: "0.50 Carat",
          subcategory: "Engagement Rings",
          isBestseller: false,
          inStock: true,
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const category = searchParams.get("category") || "All";
    const subcategory = searchParams.get("subcategory");

    if (category !== selectedCategory) {
      setSelectedCategory(category);
    }

    if (subcategory) {
      if (!activeSubcategories.includes(subcategory)) {
        setActiveSubcategories([subcategory]);
      }
    } else {
      // If no subcategory in URL, don't necessarily clear unless it's a category change
      // But logic suggests if we navigate to "Shop", we probably want clear filters.
      // For now, let's keep it simple.
    }
  }, [searchParams]);

  // Update URL when category changes via UI
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    // Reset subcategories when main category changes
    setActiveSubcategories([]);
    setSearchParams({ category });
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const toggleSubcategory = (subcategory: string) => {
    setActiveSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const filteredProducts = products.filter((product) => {
    // Category filter
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false;
    }

    // Subcategory filter
    if (activeSubcategories.length > 0 && !activeSubcategories.includes(product.subcategory)) {
      return false;
    }

    // Active filters
    for (const filter of activeFilters) {
      if (filters.goldType.includes(filter) && !product.goldType.includes(filter.replace(" Gold", ""))) {
        return false;
      }

      // Price range filter
      if (filters.priceRange.includes(filter)) {
        const price = parseInt(product.price.replace(/[₹,]/g, ""));
        if (filter === "Under ₹50,000" && price >= 50000) return false;
        if (filter === "₹50,000 - ₹1,00,000" && (price < 50000 || price > 100000)) return false;
        if (filter === "₹1,00,000 - ₹2,50,000" && (price < 100000 || price > 250000)) return false;
        if (filter === "Above ₹2,50,000" && price <= 250000) return false;
      }

      // Availability filter
      if (filters.availability.includes(filter)) {
        if (filter === "In Stock" && !product.inStock) return false;
      }
    }

    return true;
  });

  return (
    <main className="pt-24 pb-16 min-h-screen bg-cream/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-gold-dark transition-colors">Home</Link>
          <span>/</span>
          <span className="text-brown-deep font-medium">Shop</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-brown-deep mb-2">
              {selectedCategory === "All" ? "Our Collection" : selectedCategory}
            </h1>
            <p className="text-brown-dark/70">
              Discover exquisite pieces
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2 border border-brown-deep/20 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === "grid" ? "bg-gold text-white" : "text-brown-deep/60 hover:text-brown-deep"
                )}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded transition-colors",
                  viewMode === "list" ? "bg-gold text-white" : "text-brown-deep/60 hover:text-brown-deep"
                )}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden border-brown-deep/20 text-brown-deep"
            >
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters
            </Button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select className="appearance-none bg-white border border-brown-deep/20 rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-gold text-brown-deep cursor-pointer">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brown-deep pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 border",
                selectedCategory === category
                  ? "bg-brown-deep text-cream border-brown-deep shadow-lg scale-105"
                  : "bg-white text-brown-deep border-brown-deep/10 hover:border-gold hover:text-gold-dark"
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Active Filters */}
        {(activeFilters.length > 0 || activeSubcategories.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-sm text-brown-dark/70">Active Filters:</span>
            {activeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className="flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/20 rounded-full text-sm hover:bg-gold/20 transition-colors"
              >
                {filter}
                <X className="h-3 w-3" />
              </button>
            ))}
            {activeSubcategories.map((subcategory) => (
              <button
                key={subcategory}
                onClick={() => toggleSubcategory(subcategory)}
                className="flex items-center gap-1 px-3 py-1 bg-gold/10 text-gold-dark border border-gold/20 rounded-full text-sm hover:bg-gold/20 transition-colors"
              >
                {subcategory}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              onClick={() => {
                setActiveFilters([]);
                setActiveSubcategories([]);
              }}
              className="text-sm text-brown-deep underline hover:text-gold-dark transition-colors"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8 pr-4">
              {/* Render Subcategories first if a category is selected */}
              {selectedCategory !== "All" && subcategories[selectedCategory] && (
                <div className="border-b border-brown-deep/10 pb-6">
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">
                    {selectedCategory}
                  </h3>
                  <div className="space-y-3">
                    {subcategories[selectedCategory].map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={activeSubcategories.includes(value)}
                            onChange={() => toggleSubcategory(value)}
                            className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors"
                          />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(filters).map(([key, values]) => (
                <div key={key}>
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 capitalize text-lg">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <div className="space-y-3">
                    {values.map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={activeFilters.includes(value)}
                            onChange={() => toggleFilter(value)}
                            className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors"
                          />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">
                          {value}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-brown-deep/5">
                <p className="font-serif text-xl text-brown-deep mb-2">No products found</p>
                <p className="text-muted-foreground">Try adjusting your filters or category</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setActiveFilters([]);
                    setActiveSubcategories([]);
                    if (selectedCategory !== "All") setSelectedCategory("All");
                  }}
                  className="mt-4 text-gold-dark"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            )}

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button className="bg-brown-deep text-cream hover:bg-brown-dark px-8 py-6 rounded-none text-lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-brown-dark/60 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background p-6 shadow-luxury overflow-y-auto animate-slide-in-right">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl font-bold text-primary">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-8">
              {selectedCategory !== "All" && subcategories[selectedCategory] && (
                <div>
                  <h3 className="font-serif font-semibold text-primary mb-4">
                    Subcategory
                  </h3>
                  <div className="space-y-3">
                    {subcategories[selectedCategory].map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeSubcategories.includes(value)}
                          onChange={() => toggleSubcategory(value)}
                          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {Object.entries(filters).map(([key, values]) => (
                <div key={key}>
                  <h3 className="font-serif font-semibold text-primary mb-4 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </h3>
                  <div className="space-y-3">
                    {values.map((value) => (
                      <label
                        key={value}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={activeFilters.includes(value)}
                          onChange={() => toggleFilter(value)}
                          className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                        />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setActiveFilters([]);
                  setActiveSubcategories([]);
                }}
              >
                Clear All
              </Button>
              <Button
                className="flex-1 bg-brown-deep text-cream"
                onClick={() => setShowFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Shop;
