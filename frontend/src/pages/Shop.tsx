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

// Categories and subcategories will be fetched dynamically


const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSubcategory = searchParams.get("subcategory");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [allCategoriesData, setAllCategoriesData] = useState<any[]>([]); // Store full category data for ID lookup
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({});
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Dynamic Filters State
  const [availableFilters, setAvailableFilters] = useState({
    goldPurity: [] as string[],
    metalColor: [] as string[],
    diamondQuality: [] as string[],
    colorStoneType: [] as string[],
    priceRange: ["Under ₹50,000", "₹50,000 - ₹1,00,000", "₹1,00,000 - ₹2,50,000", "Above ₹2,50,000"],
    availability: ["In Stock"]
  });

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [activeSubcategories, setActiveSubcategories] = useState<string[]>(initialSubcategory ? [initialSubcategory] : []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/categories`);
        const data = await response.json();
        setAllCategoriesData(data); // Save full data

        const topLevel = data.filter((cat: any) => !cat.parent);
        const catNames = ["All", ...topLevel.map((c: any) => c.name)];

        const subMap: Record<string, string[]> = {};
        topLevel.forEach((parent: any) => {
          subMap[parent.name] = data
            .filter((c: any) => c.parent && c.parent._id === parent._id)
            .map((c: any) => c.name);
        });

        setCategories(catNames);
        setSubcategories(subMap);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/products`);
        const data = await response.json();

        const formattedProducts = data.map((p: any) => ({
          ...p,
          id: p._id,
          // Handle images array or singular image field
          image: getImageUrl((p.images && p.images.length > 0) ? p.images[0] : p.image),
          price: (p.priceBreakup?.grandTotal > 0) ? p.priceBreakup.grandTotal : p.price,
          originalPrice: p.price,
          inStock: p.inStock !== undefined ? p.inStock : true,
        }));

        setProducts(formattedProducts);

        // Extract Dynamic Filters
        const goldPurity = new Set<string>();
        const metalColor = new Set<string>();
        const diamondQuality = new Set<string>();
        const colorStoneType = new Set<string>();

        formattedProducts.forEach((p: any) => {
          if (p.goldDetails?.metalPurity) goldPurity.add(p.goldDetails.metalPurity);
          if (p.goldDetails?.metalColor) metalColor.add(p.goldDetails.metalColor);
          if (p.diamondDetails && Array.isArray(p.diamondDetails)) {
            p.diamondDetails.forEach((d: any) => {
              if (d.quality) diamondQuality.add(d.quality);
            });
          }
          if (p.colorStoneDetails && Array.isArray(p.colorStoneDetails)) {
            p.colorStoneDetails.forEach((c: any) => {
              if (c.quality) colorStoneType.add(c.quality);
            });
          }
        });

        setAvailableFilters(prev => ({
          ...prev,
          goldPurity: Array.from(goldPurity).filter(Boolean),
          metalColor: Array.from(metalColor).filter(Boolean),
          diamondQuality: Array.from(diamondQuality).filter(Boolean),
          colorStoneType: Array.from(colorStoneType).filter(Boolean)
        }));

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
    if (selectedCategory !== "All") {
      // Find the ID of the selected category name (handle slug format from URL)
      // e.g. "bangles-and-bracelet" -> "Bangles and Bracelet"
      const normalizedSelected = selectedCategory.replace(/-/g, ' ').toLowerCase();

      const catObj = allCategoriesData.find(c =>
        c.name.toLowerCase() === normalizedSelected ||
        c.name === selectedCategory
      );

      if (catObj) {
        if (product.category !== catObj._id) return false;
      } else {
        // Fallback: If no ID found (maybe name mismatch), try matching category Name string if backend allows?
        // But currently filtering by ID. If we can't find the category object, we can't filter safely.
        // Try precise name match on formatted products if category is populated as object? 
        // But product.category is ID string usually. 
        return false;
      }
    }

    // Subcategory filter
    if (activeSubcategories.length > 0 && !activeSubcategories.includes(product.subcategory)) {
      return false;
    }

    // Active filters
    if (activeFilters.length === 0) return true;

    // Check each filter category if any active filter belongs to it
    // Note: This logic assumes simple single-select per group OR AND across groups. 
    // But since filters are a flat list `activeFilters`, we need to check which group a filter belongs to.
    // Simpler approach: Check if product matches ANY of the active filters if we treat them as OR?
    // Standard e-commerce usually: OR within same group, AND across groups.
    // Given the simple flat `activeFilters` array, let's iterate and check.

    // We need to know which group a selected filter string belongs to.

    // Group Active Filters
    const selectedGoldPurity = activeFilters.filter(f => availableFilters.goldPurity.includes(f));
    const selectedMetalColor = activeFilters.filter(f => availableFilters.metalColor.includes(f));
    const selectedDiamondQuality = activeFilters.filter(f => availableFilters.diamondQuality.includes(f));
    const selectedColorStone = activeFilters.filter(f => availableFilters.colorStoneType.includes(f));
    const selectedPrice = activeFilters.filter(f => availableFilters.priceRange.includes(f));
    const selectedAvailability = activeFilters.filter(f => availableFilters.availability.includes(f));

    // Gold Purity Check
    if (selectedGoldPurity.length > 0) {
      if (!selectedGoldPurity.includes(product.goldDetails?.metalPurity)) return false;
    }

    // Metal Color Check
    if (selectedMetalColor.length > 0) {
      if (!selectedMetalColor.includes(product.goldDetails?.metalColor)) return false;
    }

    // Diamond Quality Check
    if (selectedDiamondQuality.length > 0) {
      const hasQuality = product.diamondDetails?.some((d: any) => selectedDiamondQuality.includes(d.quality));
      if (!hasQuality) return false;
    }

    // Color Stone Check
    if (selectedColorStone.length > 0) {
      const hasStone = product.colorStoneDetails?.some((c: any) => selectedColorStone.includes(c.quality));
      if (!hasStone) return false;
    }

    // Price Range Filter
    if (selectedPrice.length > 0) {
      // Use grandTotal or price? Model has grandTotal in priceBreakup, but root price might be used too.
      // Let's use `grandTotal` if available, else `price`.
      const price = product.priceBreakup?.grandTotal || product.price || 0;

      const inRange = selectedPrice.some(range => {
        if (range === "Under ₹50,000") return price < 50000;
        if (range === "₹50,000 - ₹1,00,000") return price >= 50000 && price <= 100000;
        if (range === "₹1,00,000 - ₹2,50,000") return price >= 100000 && price <= 250000;
        if (range === "Above ₹2,50,000") return price > 250000;
        return false;
      });
      if (!inRange) return false;
    }

    // Availability
    if (selectedAvailability.length > 0) {
      if (!product.inStock) return false;
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

              {/* Dynamic Filters Render */}
              {availableFilters.goldPurity.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Gold Purity</h3>
                  <div className="space-y-3">
                    {availableFilters.goldPurity.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {availableFilters.metalColor.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Metal Color</h3>
                  <div className="space-y-3">
                    {availableFilters.metalColor.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {availableFilters.diamondQuality.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Diamond Quality</h3>
                  <div className="space-y-3">
                    {availableFilters.diamondQuality.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {availableFilters.colorStoneType.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Color Stone</h3>
                  <div className="space-y-3">
                    {availableFilters.colorStoneType.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                          <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                          <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Price Range</h3>
                <div className="space-y-3">
                  {availableFilters.priceRange.map(value => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-serif font-semibold text-brown-deep mb-4 text-lg">Availability</h3>
                <div className="space-y-3">
                  {availableFilters.availability.map(value => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="peer w-4 h-4 rounded border-brown-deep/30 text-gold focus:ring-gold appearance-none border checked:bg-gold checked:border-gold transition-colors" />
                        <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <span className="text-sm text-brown-dark/80 group-hover:text-gold-dark transition-colors">{value}</span>
                    </label>
                  ))}
                </div>
              </div>
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


              {/* Mobile Filter Render */}
              {availableFilters.goldPurity.length > 0 && (
                <div>
                  <h3 className="font-serif font-semibold text-primary mb-4">Gold Purity</h3>
                  <div className="space-y-3">
                    {availableFilters.goldPurity.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {availableFilters.metalColor.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-serif font-semibold text-primary mb-4">Metal Color</h3>
                  <div className="space-y-3">
                    {availableFilters.metalColor.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {availableFilters.diamondQuality.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-serif font-semibold text-primary mb-4">Diamond Quality</h3>
                  <div className="space-y-3">
                    {availableFilters.diamondQuality.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {availableFilters.colorStoneType.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-serif font-semibold text-primary mb-4">Color Stone</h3>
                  <div className="space-y-3">
                    {availableFilters.colorStoneType.map(value => (
                      <label key={value} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                        <span className="text-sm text-foreground/80">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6">
                <h3 className="font-serif font-semibold text-primary mb-4">Price Range</h3>
                <div className="space-y-3">
                  {availableFilters.priceRange.map(value => (
                    <label key={value} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={activeFilters.includes(value)} onChange={() => toggleFilter(value)} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
                      <span className="text-sm text-foreground/80">{value}</span>
                    </label>
                  ))}
                </div>
              </div>

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
