
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config";

interface CategoryShowcaseProps {
    categoryName?: string;
    title?: string;
    subtitle?: string;
    image?: string;
}

const CategoryShowcase = ({
    categoryName = "Rings",
    title = "Rings that fit right into your routine",
    subtitle = "Discover our exquisite collection",
    image = "/category-rings-banner.jpg" // Placeholder or use a prop
}: CategoryShowcaseProps) => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/products`);
                const data = await response.json();

                // Filter by category (case-insensitive partial match)
                const categoryProducts = data.filter((p: any) =>
                    p.categoryDetails?.name?.toLowerCase().includes(categoryName.toLowerCase()) ||
                    p.category?.toLowerCase().includes(categoryName.toLowerCase())
                );

                setProducts(categoryProducts.slice(0, 4)); // Take first 4
            } catch (error) {
                console.error("Failed to fetch category products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    if (products.length === 0 && !loading) return null;

    return (
        <section className="bg-background py-12">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col lg:flex-row h-auto lg:h-[500px] rounded-3xl overflow-hidden shadow-lg border border-border/50">

                    {/* Banner Section - Left/Top */}
                    <div className="lg:w-1/3 relative bg-[#5D4037] text-white p-12 flex flex-col justify-center items-start overflow-hidden">
                        {/* Background gradient/overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#5D4037] to-[#3E2723] z-0" />

                        {/* Decorative Rings Pattern/Image if desired */}
                        <div className="relative z-10 space-y-6">
                            <h2 className="font-serif text-4xl md:text-5xl font-medium leading-tight">
                                {title}
                            </h2>
                            <p className="text-white/80 text-lg">{subtitle}</p>
                            <Button asChild variant="secondary" className="mt-4">
                                <Link to={`/shop?category=${categoryName.toLowerCase()}`}>
                                    View Full Collection <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    {/* Products Section - Right/Bottom */}
                    <div className="lg:w-2/3 bg-[#E6E6FA]/30 p-8 flex items-center">
                        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                            {products.map((product) => {
                                const diamondWt = product.diamondDetails?.reduce((acc: number, cur: any) => acc + (cur.weight * cur.count), 0) || 0;
                                return (
                                    <div key={product._id} className="min-w-[200px]"> {/* Wrap to ensure width in flex if needed, though grid handles it */}
                                        <ProductCard
                                            id={product._id}
                                            name={product.name}
                                            image={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${API_BASE_URL}/${product.images[0].replace(/^uploads[\\/]/, 'uploads/')}`) : ""}
                                            price={`₹${Math.round((product.priceBreakup?.grandTotal > 0) ? product.priceBreakup.grandTotal : product.price).toLocaleString()}`}
                                            goldType={product.goldDetails?.metalPurity ? `${product.goldDetails.metalPurity} Gold` : "22KT Gold"}
                                            diamondWeight={diamondWt > 0 ? `${diamondWt.toFixed(2)} Carat` : ""}
                                            isNew={product.isNew}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default CategoryShowcase;
