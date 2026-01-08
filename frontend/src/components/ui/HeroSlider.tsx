import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Gem } from "lucide-react"; // Assuming lucide-react for icons

interface HeroSliderProps {
    images?: string[];
    className?: string;
}

const HeroSlider = ({ images, className }: HeroSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<{
        id: string;
        image: string;
        title: string;
        titleColor: string;
        description: string;
        descriptionColor: string;
    }[]>([]);

    useEffect(() => {
        if (images && images.length > 0) {
            // Use provided static images
            const formattedSlides = images.map((img, index) => ({
                id: `static-${index}`,
                image: img,
                title: "",
                titleColor: "",
                description: "",
                descriptionColor: ""
            }));
            setSlides(formattedSlides);
        } else {
            // Fetch hero images from API
            const fetchSlides = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/hero');
                    const data = await res.json();
                    const formattedSlides = data.map((item: any) => ({
                        id: item._id,
                        image: `http://localhost:5000/${item.image}`,
                        title: item.title || '',
                        titleColor: item.titleColor || '#FFFFFF',
                        description: item.description || '',
                        descriptionColor: item.descriptionColor || '#FFFFFF'
                    }));
                    setSlides(formattedSlides);
                } catch (error) {
                    console.error("Failed to fetch hero slides:", error);
                }
            };
            fetchSlides();
        }
    }, [images]);

    useEffect(() => {
        if (slides.length === 0) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides]);

    const nextSlide = () => {
        if (slides.length > 0) setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        if (slides.length > 0) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    if (slides.length === 0) {
        return <div className="h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className={`relative overflow-hidden group ${className || "h-screen"}`}>
            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0">
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/1920x600?text=Image+Not+Found';
                            }}
                        />
                        <div className="absolute inset-0 bg-black/20" /> {/* Overlay */}
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                        <div className="max-w-3xl">
                            {slides[currentSlide].title && (
                                <h1
                                    className="text-4xl md:text-6xl font-serif font-bold mb-4 drop-shadow-md"
                                    style={{ color: slides[currentSlide].titleColor }}
                                >
                                    {slides[currentSlide].title}
                                </h1>
                            )}
                            {slides[currentSlide].description && (
                                <p
                                    className="text-lg md:text-xl font-light drop-shadow-md"
                                    style={{ color: slides[currentSlide].descriptionColor }}
                                >
                                    {slides[currentSlide].description}
                                </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm p-2 rounded-full text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 ${currentSlide === index ? "scale-125 opacity-100" : "scale-100 opacity-50 hover:opacity-75"}`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <img
                            src="/diamond-nav-transparent.png"
                            alt="nav-dot"
                            className="w-8 h-8 object-contain drop-shadow-md"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HeroSlider;
