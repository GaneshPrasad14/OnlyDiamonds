import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Search, Heart, ShoppingBag, User, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";



// Define types for navigation items
type NavItem = {
  name: string;
  href: string;
  isMegaMenu?: boolean;
  isDropdown?: boolean;
  items?: { name: string; href: string }[];
};

const navigation: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop", isMegaMenu: true },
  {
    name: "Discover",
    href: "#",
    isDropdown: true,
    items: [
      { name: "Know Your Diamonds", href: "/know-diamonds" },
      { name: "Know Your Jewel", href: "/customize" }
    ]
  },
  // { name: "Magic Diamonds", href: "/magic-diamonds" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [categories, setCategories] = useState<{ name: string; subcategories: string[] }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileExpandedCategory, setMobileExpandedCategory] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, wishlistItems } = useShop();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories");
        const data = await response.json();

        // Transform the flat data into the structure needed for the menu
        const topLevel = data.filter((cat: any) => !cat.parent);
        const structure = topLevel.map((parent: any) => {
          const subcategories = data
            .filter((cat: any) => cat.parent && cat.parent._id === parent._id)
            .map((cat: any) => cat.name);

          return {
            name: parent.name,
            subcategories
          };
        });

        setCategories(structure);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCategoryClick = (category: string, subcategory?: string) => {
    setIsOpen(false);
    setHoveredCategory(null);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-serif",
        isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-soft py-2"
          : "bg-gradient-to-b from-primary via-primary/80 to-transparent py-4"
      )}
      onMouseLeave={() => setHoveredCategory(null)}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group relative z-50">
            <img src="/logo.png" alt="Only Diamonds" className="h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative group"
                onMouseEnter={() => {
                  if (item.isMegaMenu) setHoveredCategory("Shop");
                  else if (item.isDropdown) setHoveredCategory(item.name);
                  else setHoveredCategory(null);
                }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "relative text-sm font-medium tracking-wide transition-colors duration-300 flex items-center gap-1 uppercase",
                    location.pathname === item.href || (item.name === "Shop" && location.pathname.startsWith("/shop"))
                      ? "text-gold font-semibold"
                      : "text-cream/90 hover:text-gold",
                    "after:absolute after:bottom-[-4px] after:left-0 after:h-[1px] after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
                  )}
                  onClick={(e) => {
                    if (item.isDropdown) e.preventDefault();
                  }}
                >
                  {item.name}
                  {(item.isMegaMenu || item.isDropdown) && <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform" />}
                </Link>

                {/* Standard Dropdown */}
                {item.isDropdown && (
                  <div className={cn(
                    "absolute top-full left-0 min-w-[200px] bg-[#FAFAFA] shadow-luxury rounded-b-lg py-2 transition-all duration-300",
                    hoveredCategory === item.name ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2 pointer-events-none"
                  )}>
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="block px-6 py-3 text-sm text-brown-deep hover:bg-gold/10 hover:text-gold-dark transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-5 text-cream/90">
            <button className="p-2 hover:text-gold transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="p-2 hover:text-gold transition-colors relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-[10px] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="p-2 hover:text-gold transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-gold text-[10px] rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                {cartItems.length}
              </span>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn("lg:hidden p-2 z-50", isOpen ? "text-brown-deep" : "text-cream")}
          >
            {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mega Menu - Desktop */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full bg-[#FAFAFA] border-t border-brown-deep/10 shadow-luxury transition-all duration-500 overflow-hidden",
            hoveredCategory === "Shop" ? "max-h-[600px] opacity-100 visible" : "max-h-0 opacity-0 invisible"
          )}
          onMouseEnter={() => setHoveredCategory("Shop")}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <div className="container mx-auto px-8 py-12">
            <div className="grid grid-cols-5 gap-8">
              {categories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <h3
                    onClick={() => handleCategoryClick(category.name)}
                    className="font-serif text-lg font-semibold text-brown-deep border-b border-brown-deep/10 pb-2 cursor-pointer hover:text-gold-dark transition-colors"
                  >
                    {category.name}
                  </h3>
                  <ul className="space-y-3">
                    {category.subcategories.map((sub) => (
                      <li key={sub}>
                        <button
                          onClick={() => handleCategoryClick(category.name, sub)}
                          className="text-sm text-brown-dark/70 hover:text-gold hover:translate-x-1 transition-all duration-300 text-left block w-full"
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-brown-deep/5 flex justify-center">
              <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-brown-dark hover:text-gold-dark transition-colors font-medium border-b border-transparent hover:border-gold-dark pb-1" onClick={() => setHoveredCategory(null)}>
                View All Collections
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "fixed inset-0 bg-cream/95 backdrop-blur-xl z-40 lg:hidden pt-24 px-6 transition-all duration-500 overflow-y-auto",
            isOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
          )}
        >
          <div className="flex flex-col gap-6 font-serif">
            {navigation.map((item) => (
              <div key={item.name} className="border-b border-brown-deep/5 pb-4 last:border-0">
                {item.isMegaMenu || item.isDropdown ? (
                  <div className="space-y-4">
                    <button
                      onClick={() => setMobileExpandedCategory(mobileExpandedCategory === item.name ? null : item.name)}
                      className="flex items-center justify-between w-full text-xl text-brown-deep font-medium"
                    >
                      {item.name}
                      <ChevronDown className={cn("w-5 h-5 transition-transform", mobileExpandedCategory === item.name && "rotate-180")} />
                    </button>

                    <div className={cn("space-y-4 pl-4 overflow-hidden transition-all duration-500", mobileExpandedCategory === item.name ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0")}>
                      {item.name === "Shop" ? (
                        categories.map((cat) => (
                          <div key={cat.name} className="space-y-2">
                            <button
                              onClick={() => handleCategoryClick(cat.name)}
                              className="text-lg text-brown-deep/90 font-medium text-left w-full hover:text-gold"
                            >
                              {cat.name}
                            </button>
                            <div className="pl-4 space-y-2 border-l border-gold/20">
                              {cat.subcategories.map(sub => (
                                <button
                                  key={sub}
                                  onClick={() => handleCategoryClick(cat.name, sub)}
                                  className="block text-base text-brown-dark/60 py-1 text-left w-full hover:text-gold"
                                >
                                  {sub}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        item.items?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="block text-lg text-brown-deep/90 font-medium hover:text-gold"
                          >
                            {subItem.name}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block text-xl text-brown-deep font-medium hover:text-gold-dark transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
