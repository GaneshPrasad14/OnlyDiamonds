import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// Placeholder image if generation failed, or use a local asset if available.
// Using a high-quality fallback from Unsplash or similar would be ideal, 
// but for now we'll use a placeholder or one of the existing KYD images if they fit.
// Let's assume we want a generic nice diamond image.
// I'll use a placeholder URL for now which the user can replace.
const DIAMOND_IMAGE = "/wodi.JPG";

const leftPoints = [
    "100% Own Manufacturing",
    "100% Buy Back Guarantee",
    "More than 37 years of expertise",
    "Guaranteed Quality"
];

const rightPoints = [
    "Lowest Price Guarantee",
    "Clear Price Break-Up",
    "Customization",
    "Certified Jewellery"
];

const PointItem = ({ text, align = "left", delay }: { text: string; align?: "left" | "right"; delay: number }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: align === "left" ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : "flex-row text-left"} group w-full`}
        >
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-300">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                </div>
            </div>
            <span className="font-serif text-base md:text-lg text-primary/80 group-hover:text-primary transition-colors duration-300">
                {text}
            </span>
        </motion.div>
    );
};

const WhyOnlyDiamonds = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-cream/20 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="text-center mb-16">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-accent font-medium tracking-[0.2em] uppercase mb-3"
                    >
                        The Only Diamonds Difference
                    </motion.p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-2">
                    {/* Left Points */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/4 order-2 lg:order-1 items-end pr-4">
                        {leftPoints.map((point, index) => (
                            <PointItem key={point} text={point} align="right" delay={index * 0.1} />
                        ))}
                    </div>

                    {/* Center Image */}
                    <div className="w-full lg:w-1/3 order-1 lg:order-2 flex justify-center relative z-10 px-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative w-full max-w-xs"
                        >
                            {/* Wave Animation Border */}
                            <motion.div
                                className="absolute -inset-4 rounded-3xl border-2 border-accent/30"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 1, -1, 0],
                                    borderRadius: ["1.5rem", "2rem", "1.5rem"]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute -inset-8 rounded-[2rem] border border-accent/10"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, -2, 2, 0],
                                    borderRadius: ["2rem", "2.5rem", "2rem"]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 0.5
                                }}
                            />

                            {/* Image Container */}
                            <div className="relative p-1 bg-background/80 backdrop-blur-md rounded-2xl border border-accent/20 z-10 shadow-2xl">
                                <img
                                    src={DIAMOND_IMAGE}
                                    alt="Why Only Diamonds"
                                    className="w-full h-auto rounded-xl"
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Points */}
                    <div className="flex flex-col gap-6 w-full lg:w-1/4 order-3 lg:order-3 items-start pl-4">
                        {rightPoints.map((point, index) => (
                            <PointItem key={point} text={point} align="left" delay={index * 0.1} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyOnlyDiamonds;
