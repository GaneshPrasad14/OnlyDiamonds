
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { API_BASE_URL } from "@/config";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const NewArrivals = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/products`);
                const data = await response.json();
                // Assuming data is array of products. Ideally sort by createdAt desc if available.
                // For now, reverse to show latest if appended at end, or slice.
                const latestProducts = data.slice(-8).reverse();
                setProducts(latestProducts);
            } catch (error) {
                console.error("Failed to fetch new arrivals", error);
            }
        };

        fetchProducts();
    }, []);

    if (products.length === 0) return null;

    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
                    <div>
                        <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
                            Fresh from the Atelier
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary">
                            Current Offers & New Arrivals
                        </h2>
                    </div>
                    <Link
                        to="/shop?sort=newest"
                        className="flex items-center gap-2 text-accent font-medium hover:gap-4 transition-all duration-300 mt-4 md:mt-0"
                    >
                        View All Offers
                        <ArrowRight className="h-5 w-5" />
                    </Link>
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
                            {products.map((product) => {
                                const diamondWt = product.diamondDetails?.reduce((acc: number, cur: any) => acc + (cur.weight * cur.count), 0) || 0;
                                return (
                                    <CarouselItem key={product._id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                                        <ProductCard
                                            id={product._id}
                                            name={product.name}
                                            image={product.images && product.images.length > 0 ? (product.images[0].startsWith('http') ? product.images[0] : `${API_BASE_URL}/${product.images[0].replace(/^uploads[\\/]/, 'uploads/')}`) : ""}
                                            price={`₹${Math.round((product.priceBreakup?.grandTotal > 0) ? product.priceBreakup.grandTotal : product.price).toLocaleString()}`}
                                            goldType={product.goldDetails?.metalPurity ? `${product.goldDetails.metalPurity} Gold` : "22KT Gold"}
                                            diamondWeight={diamondWt > 0 ? `${diamondWt.toFixed(2)} Carat` : ""}
                                            isNew={true} // Force new badge for new arrivals
                                        />
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
