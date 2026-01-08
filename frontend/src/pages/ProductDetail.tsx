import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Heart, Share2, ShoppingBag, Shield, RefreshCw, Truck, ChevronLeft, ChevronRight, ZoomIn, Check, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import productRing1 from "@/assets/product-ring-1.jpg";
import productEarrings1 from "@/assets/product-earrings-1.jpg";
import productPendant1 from "@/assets/product-pendant-1.jpg";
import productNecklace1 from "@/assets/product-necklace-1.jpg";
const INDIAN_RING_SIZES = [
  { size: "1", diameter: "13.00", circumference: "40.80" },
  { size: "2", diameter: "13.40", circumference: "42.10" },
  { size: "3", diameter: "13.70", circumference: "43.00" },
  { size: "4", diameter: "14.00", circumference: "44.00" },
  { size: "5", diameter: "14.30", circumference: "44.90" },
  { size: "6", diameter: "14.60", circumference: "45.90" },
  { size: "7", diameter: "15.00", circumference: "47.10" },
  { size: "8", diameter: "15.30", circumference: "48.10" },
  { size: "9", diameter: "15.60", circumference: "49.00" },
  { size: "10", diameter: "15.90", circumference: "50.00" },
  { size: "11", diameter: "16.20", circumference: "50.90" },
  { size: "12", diameter: "16.50", circumference: "51.80" },
  { size: "13", diameter: "16.80", circumference: "52.80" },
  { size: "14", diameter: "17.20", circumference: "54.00" },
  { size: "15", diameter: "17.50", circumference: "55.00" },
  { size: "16", diameter: "17.80", circumference: "55.90" },
  { size: "17", diameter: "18.10", circumference: "56.90" },
  { size: "18", diameter: "18.40", circumference: "57.80" },
  { size: "19", diameter: "18.80", circumference: "59.10" },
  { size: "20", diameter: "19.10", circumference: "60.00" },
  { size: "21", diameter: "19.40", circumference: "61.00" },
  { size: "22", diameter: "19.70", circumference: "61.90" },
  { size: "23", diameter: "20.00", circumference: "62.80" },
  { size: "24", diameter: "20.30", circumference: "63.80" },
  { size: "25", diameter: "20.60", circumference: "64.70" },
  { size: "26", diameter: "21.00", circumference: "66.00" },
  { size: "27", diameter: "21.30", circumference: "66.90" },
  { size: "28", diameter: "21.60", circumference: "67.90" },
  { size: "29", diameter: "22.00", circumference: "69.10" },
  { size: "30", diameter: "22.30", circumference: "70.00" },
  { size: "31", diameter: "22.60", circumference: "71.00" },
  { size: "32", diameter: "22.90", circumference: "71.90" },
  { size: "33", diameter: "23.20", circumference: "72.90" },
];

const INDIAN_BANGLE_SIZES = [
  { size: "2-2 (1\" 6/16)", diameter: "34.90" },
  { size: "2-2.5 (1\" 7/16)", diameter: "36.50" },
  { size: "2-3 (1\" 8/16)", diameter: "38.10" },
  { size: "2-3.5 (1\" 9/16)", diameter: "39.70" },
  { size: "2-4 (1\" 10/16)", diameter: "41.30" },
  { size: "2-4.5 (1\" 11/16)", diameter: "42.90" },
  { size: "2-5 (1\" 12/16)", diameter: "44.40" },
  { size: "2-5.5 (1\" 13/16)", diameter: "46.00" },
  { size: "2-6 (1\" 14/16)", diameter: "47.60" },
  { size: "2-6.5 (1\" 15/16)", diameter: "49.20" },
  { size: "2-8 (2\")", diameter: "50.80" },
  { size: "2-9 (2\" 1/16)", diameter: "52.40" },
  { size: "2-10 (2\" 2/16)", diameter: "54.00" },
  { size: "2-11 (2\" 3/16)", diameter: "55.60" },
  { size: "2-12 (2\" 4/16)", diameter: "57.20" },
  { size: "2-13 (2\" 5/16)", diameter: "58.70" },
  { size: "2-14 (2\" 6/16)", diameter: "60.30" },
  { size: "2-15 (2\" 7/16)", diameter: "61.90" },
  { size: "3-0 (2\" 8/16)", diameter: "63.50" },
  { size: "3-1 (2\" 9/16)", diameter: "65.10" },
  { size: "3-2 (2\" 10/16)", diameter: "66.70" },
  { size: "3-3 (2\" 11/16)", diameter: "68.30" },
];

// Base Rates
const GOLD_RATE_14K = 4500;
const GOLD_RATE_18K = 5800; // Example
const GOLD_RATE_22K = 7100; // Example
const DIAMOND_RATE_IJ_SI = 65000;
const DIAMOND_RATE_GH_VS = 85000;
const DIAMOND_RATE_VVS_EF = 105000;
const DIAMOND_RATE_EF_IF_VVS1 = 125000;

const BASE_MAKING_CHARGES = 24876;
const TAX_RATE = 0.03;

const SizeGuideModal = () => (
  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle className="font-serif text-2xl text-center text-primary">Size Guide</DialogTitle>
    </DialogHeader>
    <Tabs defaultValue="measure" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="measure">How to Measure</TabsTrigger>
        <TabsTrigger value="faq">FAQs</TabsTrigger>
      </TabsList>
      <TabsContent value="measure" className="space-y-6 pt-4">
        <div className="space-y-6">
          <div className="bg-cream rounded-lg p-6">
            <h3 className="font-serif text-xl font-medium text-brown-deep mb-4">Method 1: Using an Existing Ring</h3>
            <ol className="list-decimal list-inside space-y-2 text-brown-dark/80">
              <li>Choose a ring that already fits your finger well.</li>
              <li>Measure the inner diameter of the ring in millimeters (mm).</li>
              <li>Use the measurement chart to match the size of your ring to the closest size in mm.</li>
            </ol>
          </div>
          <div className="bg-cream rounded-lg p-6">
            <h3 className="font-serif text-xl font-medium text-brown-deep mb-4">Method 2: The Hands-on Approach</h3>
            <ol className="list-decimal list-inside space-y-2 text-brown-dark/80">
              <li>Get a measuring tape, string, or strip of paper.</li>
              <li>Wrap it around the finger you'll wear your ring on.</li>
              <li>Using a pen or marker, mark where the ends meet.</li>
              <li>Lay your string or paper strip on a flat surface and measure the length in millimeters (mm). This is the circumference.</li>
              <li>Use the chart to map this circumference to the diameter/size.</li>
            </ol>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="faq" className="space-y-6 pt-4">
        <Accordion type="single" collapsible className="w-full">
          {[
            { q: "Is it possible to use a tape measure to find my ring size?", a: "Yes, if it can accurately measure in millimeters you can use a tape ring." },
            { q: "What is the average ring size for women in India?", a: "The average ring size for Indian women falls between size 11 to 14." },
            { q: "How do I measure ring size at home without a ring?", a: "You can directly measure the finger on which the ring is to be worn by using the string, paper strip, ruler, or ring sizer tool methods." },
            { q: "Does finger size change over time?", a: "Yes, due to weight changes, weather, or pregnancy the finger ring size may change over time." },
            { q: "How do I check my partner’s ring size secretly?", a: "You can borrow a ring they wear on the intended finger or ask their friends and family and use the ruler or ring size chart method to find out." },
            { q: "Is there a mobile app to measure ring size?", a: "Yes, some jewellery apps offer accurate ring sizing features using your phone." },
            { q: "Can I use a scale or caliper to measure my ring?", a: "Yes, using a scale or a caliper offers high precision results." },
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium text-brown-deep">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-brown-dark/80">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </TabsContent>
    </Tabs>
  </DialogContent>
);

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, wishlistItems, removeFromWishlist } = useShop();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/v1/products/${id}`);
        if (!response.ok) throw new Error("Product not found");
        const data = await response.json();

        // Calculate stone weight in grams for Net Weight calc
        const diamondWtCarats = data.diamondDetails?.reduce((acc: number, cur: any) => acc + (cur.weight * cur.count), 0) || 0;
        const stoneWtCarats = data.colorStoneDetails?.reduce((acc: number, cur: any) => acc + (cur.weight * cur.count), 0) || 0;
        const stoneWtGrams = (diamondWtCarats + stoneWtCarats) * 0.2;

        const grossWt = data.goldDetails?.grossWeight || 0;
        const netWt = data.priceBreakup?.netWeight || (grossWt - stoneWtGrams);

        // Map backend data to frontend structure
        const mappedProduct = {
          id: data._id,
          category: data.category,
          name: data.name,
          basePrice: data.price || 0,
          images: data.images.length > 0 ? data.images.map((img: string) => img.startsWith("http") ? img : `http://localhost:5000/${img}`) : [],
          rating: 4.8, // Default
          reviews: 124, // Default
          description: data.description,
          details: {
            gold: {
              netWt: netWt,
              grossWt: grossWt,
              purity: data.goldDetails?.metalPurity || "22kt",
              color: data.goldDetails?.metalColor || "Yellow",
              dimensions: {
                width: "N/A", // Backend "dimensions" is a string, might need parsing or just display string
                height: data.goldDetails?.dimensions || "N/A",
                length: "N/A"
              }
            },
            diamond: {
              totalWt: diamondWtCarats,
              count: data.diamondDetails?.reduce((acc: number, c: any) => acc + c.count, 0) || 0,
              brand: "Miracle",
              quality: "EF,VVS" // Default or from first entry
            },
            colorStones: {
              count: data.colorStoneDetails?.reduce((acc: number, c: any) => acc + c.count, 0) || 0,
              weight: stoneWtCarats.toFixed(2) + " ct"
            }
          },
          priceBreakup: data.priceBreakup,
          sizes: INDIAN_RING_SIZES.map(s => s.size),
          certifications: data.certifications && data.certifications.length > 0 ? data.certifications : ["SGL Certified", "BIS Hallmark", "HUID"],
        };
        setProduct(mappedProduct);

        // Initialize customization state from product defaults
        if (data.goldDetails?.metalPurity) setMetalType(data.goldDetails.metalPurity.toUpperCase());
        if (data.goldDetails?.metalColor) setMetalColor(data.goldDetails.metalColor);

      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("7");
  const [isZoomed, setIsZoomed] = useState(false);

  // Customization State - Align with backend values (22kt, 18kt...) rather than 14K/18K/22K
  const [metalType, setMetalType] = useState<string>("22KT");
  const [metalColor, setMetalColor] = useState<string>("Yellow");
  const [diamondQuality, setDiamondQuality] = useState<"EF,VVS" | "EF,IF-VVS1">("EF,VVS");
  const [selectedStoneQuality, setSelectedStoneQuality] = useState<"Natural" | "Semi-Precious" | "Synthetic">("Semi-Precious");

  // Pricing State
  const [pricing, setPricing] = useState({
    goldRate: 0,
    goldValue: 0,
    diamondRate: 0,
    diamondValue: 0,
    stoneValue: 0,
    makingCharges: 0,
    wastage: 0,
    tax: 0,
    total: 0
  });

  const isWishlisted = product ? wishlistItems.some(item => item.id === product.id) : false;

  // Recalculate Price on changes
  // NOTE: Ideally this should call an API to get accurate rates. 
  // For now, we simulate using the Breakdown logic provided.
  useEffect(() => {
    if (!product || !product.priceBreakup) return;

    // Use values from backend breakup as functional base
    // If configuration matches backend default, use backend values exactly
    const isDefaultConfig =
      metalType.toLowerCase() === product.details.gold.purity.toLowerCase() &&
      metalColor === product.details.gold.color;

    if (isDefaultConfig) {
      setPricing({
        goldRate: product.priceBreakup.goldRate,
        goldValue: product.priceBreakup.goldPrice,
        diamondRate: 0, // Mixed rates
        diamondValue: product.priceBreakup.diamondPrice,
        stoneValue: product.priceBreakup.stonePrice,
        makingCharges: product.priceBreakup.makingCharges,
        wastage: product.priceBreakup.wastage,
        tax: product.priceBreakup.gst,
        total: product.priceBreakup.grandTotal
      });
    } else {
      // Allow approximation for different purity if user changes it
      // This is complex without fetching new rates.
      // User instruction: "makesure the net weight also display"
      // We will just stick to displaying the loaded product's price for now to be safe,
      // OR simple ratio adjustment. 
      // Real implementation needs an endpoint `/api/products/:id/calculate?purity=...`
      // Let's rely on the backend values loaded initially. 
      // If user Customizes, we might revert to standard rates or warn.
      // For this task, let's keep it simple: Show the price of the PRODUCT AS SAVED.
      // Only update if we have the rates.

      // Fallback: Using the saved breakup
      setPricing({
        goldRate: product.priceBreakup.goldRate,
        goldValue: product.priceBreakup.goldPrice,
        diamondRate: 0,
        diamondValue: product.priceBreakup.diamondPrice,
        stoneValue: product.priceBreakup.stonePrice,
        makingCharges: product.priceBreakup.makingCharges,
        wastage: product.priceBreakup.wastage,
        tax: product.priceBreakup.gst,
        total: product.priceBreakup.grandTotal
      });
    }

  }, [metalType, diamondQuality, product]);


  const nextImage = () => {
    if (product) setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (product) setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: `₹${Math.round(pricing.total).toLocaleString()}`,
        image: product.images[0],
        metal: `${metalType} ${metalColor}`,
        diamond: diamondQuality,
        stone: selectedStoneQuality,
        size: selectedSize
      });
    }
  };

  if (loading) return <div className="pt-32 text-center">Loading...</div>;
  if (!product) return <div className="pt-32 text-center">Product not found</div>;


  return (
    <main className="pt-24 pb-16 min-h-screen bg-background font-serif">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-accent transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground">Rings</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-card rounded-2xl overflow-hidden group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-4 right-4 p-3 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="h-5 w-5" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-accent text-brown-dark text-xs font-medium rounded-full">
                  Bestseller
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === index
                      ? "border-accent"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(product.rating)
                          ? "fill-accent text-accent"
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-primary">
                  {`₹${Math.round(pricing.total).toLocaleString()}`}
                </span>
                <span className="text-sm text-green-700 font-medium bg-green-100 px-2 py-1 rounded">
                  Shipment Included
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">(Inclusive of all taxes)</p>
            </div>

            {/* Description */}
            <p className="text-foreground/80 leading-relaxed text-sm">
              {product.description}
            </p>

            {/* Customization Options */}
            {/* Customization Options Summary & Trigger */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-medium text-primary">Configuration</span>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-white transition-colors">
                      Customize
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="font-serif text-2xl text-primary text-center">Customize Your Jewel</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-8 pb-8">
                      {/* Metal Purity */}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary mb-3">Purity (Metal)</h3>
                        <div className="flex gap-3">
                          {(["14K", "18K", "22K"] as const).map(kt => (
                            <button
                              key={kt}
                              onClick={() => setMetalType(kt)}
                              className={cn(
                                "flex-1 p-4 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                metalType === kt
                                  ? "bg-[#A4907C] border-[#A4907C] text-white shadow-lg scale-105"
                                  : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                              )}
                            >
                              <span className="block text-xl font-bold mb-1">{kt}</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full inline-block",
                                metalType === kt ? "bg-white/20" : "bg-brown-dark/5"
                              )}>
                                Made to Order
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Metal Color */}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary mb-3">Metal Colour</h3>
                        <div className="flex gap-3">
                          {(["Yellow", "White", "Rose"] as const).map(color => (
                            <button
                              key={color}
                              onClick={() => setMetalColor(color)}
                              className={cn(
                                "flex-1 p-4 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                metalColor === color
                                  ? "bg-[#A4907C] border-[#A4907C] text-white shadow-lg scale-105"
                                  : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                              )}
                            >
                              <span className="block text-lg font-bold mb-1">{color} Gold</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full inline-block",
                                metalColor === color ? "bg-white/20" : "bg-brown-dark/5"
                              )}>
                                Made to Order
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Diamond Quality */}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary mb-3">Diamond Quality</h3>
                        <div className="flex gap-3">
                          {(["EF,VVS", "EF,IF-VVS1"] as const).map(quality => (
                            <button
                              key={quality}
                              onClick={() => setDiamondQuality(quality)}
                              className={cn(
                                "flex-1 p-4 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                diamondQuality === quality
                                  ? "bg-[#A4907C] border-[#A4907C] text-white shadow-lg scale-105"
                                  : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                              )}
                            >
                              <span className="block text-lg font-bold mb-1">{quality}</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full inline-block",
                                diamondQuality === quality ? "bg-white/20" : "bg-brown-dark/5"
                              )}>
                                Made to Order
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Stone Type Selector */}
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary mb-3">Color Stone Type</h3>
                        <div className="flex gap-3">
                          {(["Natural", "Semi-Precious", "Synthetic"] as const).map(stone => (
                            <button
                              key={stone}
                              onClick={() => setSelectedStoneQuality(stone)}
                              className={cn(
                                "flex-1 p-4 rounded-xl border-2 transition-all duration-300 text-center relative overflow-hidden group",
                                selectedStoneQuality === stone
                                  ? "bg-[#A4907C] border-[#A4907C] text-white shadow-lg scale-105"
                                  : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                              )}
                            >
                              <span className="block text-sm font-bold mb-1">{stone}</span>
                              <span className={cn(
                                "text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full inline-block",
                                selectedStoneQuality === stone ? "bg-white/20" : "bg-brown-dark/5"
                              )}>
                                Order
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Size Selector - Only for Rings & Bangles/Bracelets */}
                      {(product.category.toLowerCase().includes("ring") ||
                        product.category.toLowerCase().includes("bangle") ||
                        product.category.toLowerCase().includes("bracelet")) && (
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-serif text-lg font-semibold text-primary">Size</h3>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button className="text-sm font-medium text-accent hover:underline flex items-center gap-1">
                                    <ZoomIn className="w-3 h-3" /> Size Guide
                                  </button>
                                </DialogTrigger>
                                <SizeGuideModal />
                              </Dialog>
                            </div>

                            <div className="flex flex-wrap gap-3 max-h-60 overflow-y-auto p-1">
                              {product.category.toLowerCase().includes("bangle") || product.category.toLowerCase().includes("bracelet") ? (
                                INDIAN_BANGLE_SIZES.map(s => (
                                  <button
                                    key={s.size}
                                    onClick={() => setSelectedSize(s.size)}
                                    className={cn(
                                      "w-24 p-2 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center",
                                      selectedSize === s.size
                                        ? "bg-[#A4907C] border-[#A4907C] text-white shadow-md scale-105"
                                        : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                                    )}
                                  >
                                    <span className="text-sm font-bold">{s.size}</span>
                                    <span className="text-[10px] opacity-80">{s.diameter}mm</span>
                                    <span className={cn(
                                      "text-[8px] uppercase tracking-wider font-medium mt-1 px-1.5 py-0.5 rounded-full",
                                      selectedSize === s.size ? "bg-white/20" : "bg-brown-dark/5"
                                    )}>
                                      Order
                                    </span>
                                  </button>
                                ))
                              ) : (
                                INDIAN_RING_SIZES.map(s => (
                                  <button
                                    key={s.size}
                                    onClick={() => setSelectedSize(s.size)}
                                    className={cn(
                                      "w-16 h-20 rounded-xl border-2 transition-all text-center flex flex-col items-center justify-center",
                                      selectedSize === s.size
                                        ? "bg-[#A4907C] border-[#A4907C] text-white shadow-md scale-105"
                                        : "bg-[#F5F0EB] border-transparent hover:border-[#A4907C]/50 text-brown-dark"
                                    )}
                                  >
                                    <span className="text-lg font-bold">{s.size}</span>
                                    <span className={cn(
                                      "text-[8px] uppercase tracking-wider font-medium mt-1 px-1.5 py-0.5 rounded-full",
                                      selectedSize === s.size ? "bg-white/20" : "bg-brown-dark/5"
                                    )}>
                                      Order
                                    </span>
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                    </div>

                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          className="w-full bg-primary text-white hover:bg-primary/90"
                          onClick={() => {
                            const message = `*New Custom Order Request*%0A%0A` +
                              `*Product:* ${product.name}%0A` +
                              `*ID:* ${product.id}%0A%0A` +
                              `*Configuration:*%0A` +
                              `- Metal: ${metalType} ${metalColor} Gold%0A` +
                              `- Diamond: ${diamondQuality}%0A` +
                              `- Stone: ${selectedStoneQuality}%0A` +
                              (selectedSize ? `- Size: ${selectedSize}%0A` : '') +
                              `%0A*Estimated Price:* ₹${Math.round(pricing.total).toLocaleString()}%0A%0A` +
                              `Please confirm availability and final price.`;

                            window.open(`https://wa.me/919786123450?text=${message}`, '_blank');
                          }}
                        >
                          Request via WhatsApp
                        </Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Selection Summary */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white/50 p-2 rounded border border-brown-deep/5">
                  <span className="text-xs text-muted-foreground block">Gold Purity</span>
                  <span className="font-medium text-primary">{metalType}</span>
                </div>
                <div className="bg-white/50 p-2 rounded border border-brown-deep/5">
                  <span className="text-xs text-muted-foreground block">Gold Color</span>
                  <span className="font-medium text-primary">{metalColor} Gold</span>
                </div>
                <div className="bg-white/50 p-2 rounded border border-brown-deep/5">
                  <span className="text-xs text-muted-foreground block">Diamond Quality</span>
                  <span className="font-medium text-primary">{diamondQuality}</span>
                </div>
                <div className="bg-white/50 p-2 rounded border border-brown-deep/5">
                  <span className="text-xs text-muted-foreground block">Size</span>
                  <span className="font-medium text-primary">{selectedSize}</span>
                </div>
              </div>
            </div>


            {/* Accordion Sections for Details & Price */}
            <Accordion type="single" collapsible defaultValue="" className="w-full border rounded-lg bg-card">

              {/* Product Details Accordion */}
              <AccordionItem value="item-1" className="px-4">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent">
                  Product Details
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6 pt-2 pb-4">
                    {/* Gold Details Table */}
                    <div>
                      <h4 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wide border-b border-border/50 pb-1">Product Specifications</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Gross Weight</span>
                          <span className="font-medium">{product.details.gold.grossWt.toFixed(3)} g</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Net Weight</span>
                          <span className="font-medium">{product.details.gold.netWt.toFixed(3)} g</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Metal Purity</span>
                          <span className="font-medium">{metalType}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Metal Color</span>
                          <span className="font-medium">{metalColor}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Color Stones</span>
                          <span className="font-medium">{product.details.colorStones.count} ({product.details.colorStones.weight})</span>
                        </div>
                        {product.details.gold.dimensions && product.details.gold.dimensions.height ? (
                          <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                            <span className="text-muted-foreground">Dimensions (H x W x L)</span>
                            <span className="font-medium">{product.details.gold.dimensions.height} x {product.details.gold.dimensions.width} x {product.details.gold.dimensions.length}</span>
                          </div>
                        ) : (
                          <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                            <span className="text-muted-foreground">Dimensions</span>
                            <span className="font-medium text-muted-foreground/60">Unavailable</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Diamond Details Table */}
                    <div>
                      <h4 className="font-semibold text-primary mb-2 text-sm uppercase tracking-wide border-b border-border/50 pb-1">Diamond Information</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Total Weight</span>
                          <span className="font-medium">{product.details.diamond.totalWt} ct</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Quality</span>
                          <span className="font-medium">{diamondQuality}</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">No. of Diamonds</span>
                          <span className="font-medium">{product.details.diamond.count} diamonds</span>
                        </div>
                        <div className="flex justify-between border-b border-dashed border-border/40 pb-1">
                          <span className="text-muted-foreground">Diamond Brand</span>
                          <span className="font-medium">-</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Price Breakup Accordion */}
              <AccordionItem value="item-2" className="px-4 border-b-0">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline hover:text-accent">
                  Price Breakup
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 pb-4">
                    <div className="overflow-hidden rounded-md border border-border/50">
                      <table className="w-full text-sm">
                        <thead className="bg-primary/5 text-primary">
                          <tr className="divide-x divide-border/50">
                            <th className="px-4 py-3 text-left font-semibold">Component</th>
                            <th className="px-4 py-3 text-left font-semibold">Rate</th>
                            <th className="px-4 py-3 text-left font-semibold">Weight</th>
                            <th className="px-4 py-3 text-right font-semibold">Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                          <tr className="divide-x divide-border/50">
                            <td className="px-4 py-2 font-medium">{product.details.gold.purity} {product.details.gold.color} Gold</td>
                            <td className="px-4 py-2 text-muted-foreground">₹{pricing.goldRate}/g</td>
                            <td className="px-4 py-2 text-muted-foreground">{product.details.gold.netWt} g</td>
                            <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.goldValue).toLocaleString()}</td>
                          </tr>
                          {pricing.diamondValue > 0 && (
                            <tr className="divide-x divide-border/50">
                              <td className="px-4 py-2 font-medium">Diamond</td>
                              <td className="px-4 py-2 text-muted-foreground">-</td>
                              <td className="px-4 py-2 text-muted-foreground">{product.details.diamond.totalWt} ct</td>
                              <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.diamondValue).toLocaleString()}</td>
                            </tr>
                          )}
                          {pricing.stoneValue > 0 && (
                            <tr className="divide-x divide-border/50">
                              <td className="px-4 py-2 font-medium">Color Stones</td>
                              <td className="px-4 py-2 text-muted-foreground">-</td>
                              <td className="px-4 py-2 text-muted-foreground">{product.details.colorStones.weight}</td>
                              <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.stoneValue).toLocaleString()}</td>
                            </tr>
                          )}
                          <tr className="divide-x divide-border/50">
                            <td className="px-4 py-2 font-medium">Making Charges</td>
                            <td className="px-4 py-2 text-muted-foreground" colSpan={2}></td>
                            <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.makingCharges).toLocaleString()}</td>
                          </tr>
                          <tr className="divide-x divide-border/50">
                            <td className="px-4 py-2 font-medium">Value Addition (Wastage)</td>
                            <td className="px-4 py-2 text-muted-foreground" colSpan={2}></td>
                            <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.wastage).toLocaleString()}</td>
                          </tr>
                          <tr className="divide-x divide-border/50">
                            <td className="px-4 py-2 font-medium">GST (3%)</td>
                            <td className="px-4 py-2 text-muted-foreground" colSpan={2}>-</td>
                            <td className="px-4 py-2 text-right font-medium">₹{Math.round(pricing.tax).toLocaleString()}</td>
                          </tr>
                          <tr className="bg-primary/10 font-bold text-primary">
                            <td className="px-4 py-3" colSpan={3}>Grand Total</td>
                            <td className="px-4 py-3 text-right text-lg">₹{Math.round(pricing.total).toLocaleString()}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>


            {/* Certifications */}
            <div className="flex flex-wrap gap-3">
              {product.certifications.map((cert) => (
                <span
                  key={cert}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  <Check className="h-4 w-4" />
                  {cert}
                </span>
              ))}
            </div>



            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="hero" size="xl" className="flex-1" onClick={handleAddToCart}>
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => isWishlisted ? removeFromWishlist(product.id) : addToWishlist({
                  id: product.id,
                  name: product.name,
                  price: `₹${Math.round(pricing.total).toLocaleString()}`,
                  image: product.images[0]
                })}
                className={cn(
                  "px-4",
                  isWishlisted && "border-accent text-accent fill-accent"
                )}
              >
                <Heart className={cn("h-6 w-6", isWishlisted && "fill-accent")} />
              </Button>
              <Button variant="outline" size="xl" className="px-4">
                <Share2 className="h-6 w-6" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Above ₹25,000</p>
              </div>
              <div className="text-center">
                <RefreshCw className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Lifetime Exchange</p>
                <p className="text-xs text-muted-foreground">100% Value</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm font-medium">Certified</p>
                <p className="text-xs text-muted-foreground">SGL / IGI</p>
              </div>
            </div>


          </div>
        </div>

        {/* Zoom Modal */}
        {isZoomed && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setIsZoomed(false)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-muted/50 rounded-xl">
          <h3 className="font-semibold text-foreground mb-3">Important Information</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Actual product dimensions may vary. Please refer to the listed dimensions for the exact size.
            The color of the product may slightly vary from the image. Final prices may vary based on weight
            and size. A credit or refund will be issued if the final price is greater than the price paid,
            and any added access value will be paid by the customer. Our customer care team will provide
            you with complete pricing details before shipping the product.
          </p>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
