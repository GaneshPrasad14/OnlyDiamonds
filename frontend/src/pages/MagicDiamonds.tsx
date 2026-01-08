import { Link } from "react-router-dom";
import { Diamond, Leaf, Sparkles, Shield, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import categoryStuds from "@/assets/category-studs.jpg";
import categoryPendants from "@/assets/category-pendants.jpg";
import categoryBracelets from "@/assets/category-bracelets.jpg";

const features = [
  {
    icon: Sparkles,
    title: "Identical Brilliance",
    description: "Same optical, physical, and chemical properties as natural diamonds.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Minimal environmental impact with sustainable production.",
  },
  {
    icon: Shield,
    title: "Certified Quality",
    description: "EF Color, VVS-VS Clarity, certified by leading labs.",
  },
  {
    icon: Award,
    title: "Exceptional Value",
    description: "Premium quality at accessible price points.",
  },
];

const benefits = [
  "EF Colour - Exceptional whiteness",
  "VVS to VS Clarity - Eye clean brilliance",
  "Excellent Cut - Maximum sparkle",
  "Type IIa - Purest form of diamond",
  "Certified by IGI/SGL",
  "Conflict-free guarantee",
];

const MagicDiamonds = () => {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary via-brown-dark to-primary overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 text-6xl text-accent/10 animate-sparkle">✦</div>
        <div className="absolute bottom-10 right-10 text-6xl text-accent/10 animate-sparkle" style={{ animationDelay: "1s" }}>✦</div>
        <div className="absolute top-1/2 left-1/4 text-4xl text-accent/5 animate-sparkle" style={{ animationDelay: "0.5s" }}>✦</div>
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-6">
              <Leaf className="h-4 w-4 text-accent" />
              <span className="text-accent text-sm font-medium">Sustainable Luxury</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-cream-light mb-6">
              Magic Diamonds
            </h1>
            <p className="text-cream-light/80 text-lg leading-relaxed mb-8">
              The brilliance of a diamond, the consciousness of tomorrow. 
              Our lab-grown diamonds offer the same stunning beauty and quality 
              as natural diamonds, crafted with care for our planet.
            </p>
            <Button variant="gold" size="xl" asChild>
              <Link to="/shop?type=magic-diamonds">
                <Diamond className="h-5 w-5 mr-2" />
                Shop Magic Diamonds
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What Are Magic Diamonds */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase mb-4">
                The Science of Beauty
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
                What Are Magic Diamonds?
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Magic Diamonds are lab-grown diamonds created using cutting-edge 
                technology that replicates the natural diamond formation process. 
                They possess the exact same physical, chemical, and optical properties 
                as mined diamonds.
              </p>
              <p className="text-foreground/80 leading-relaxed mb-8">
                Each Magic Diamond is grown from a diamond seed using either High 
                Pressure High Temperature (HPHT) or Chemical Vapor Deposition (CVD) 
                technology, resulting in diamonds that are indistinguishable from 
                their natural counterparts.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square rounded-2xl overflow-hidden">
                <img src={categoryStuds} alt="Diamond Studs" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden mt-8">
                <img src={categoryPendants} alt="Diamond Pendant" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              Why Choose Magic Diamonds
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              The Smart Choice
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-500 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              The Comparison
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Magic vs Natural Diamonds
            </h2>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead className="bg-primary text-primary-foreground">
                <tr>
                  <th className="p-4 text-left font-serif">Property</th>
                  <th className="p-4 text-center font-serif">Magic Diamonds</th>
                  <th className="p-4 text-center font-serif">Natural Diamonds</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-card">
                  <td className="p-4 font-medium">Chemical Composition</td>
                  <td className="p-4 text-center">Pure Carbon ✓</td>
                  <td className="p-4 text-center">Pure Carbon ✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Hardness (Mohs Scale)</td>
                  <td className="p-4 text-center">10 ✓</td>
                  <td className="p-4 text-center">10 ✓</td>
                </tr>
                <tr className="bg-card">
                  <td className="p-4 font-medium">Refractive Index</td>
                  <td className="p-4 text-center">2.42 ✓</td>
                  <td className="p-4 text-center">2.42 ✓</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Environmental Impact</td>
                  <td className="p-4 text-center text-green-600 font-medium">Minimal ✓</td>
                  <td className="p-4 text-center text-muted-foreground">Mining Required</td>
                </tr>
                <tr className="bg-card">
                  <td className="p-4 font-medium">Price Point</td>
                  <td className="p-4 text-center text-green-600 font-medium">More Accessible ✓</td>
                  <td className="p-4 text-center text-muted-foreground">Premium</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Certification</td>
                  <td className="p-4 text-center">IGI/SGL ✓</td>
                  <td className="p-4 text-center">IGI/SGL ✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Collection Preview */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              The Collection
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-light">
              Modern Designs for the Conscious Woman
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Solitaire Studs", image: categoryStuds, price: "From ₹25,000" },
              { name: "Pendant Collection", image: categoryPendants, price: "From ₹35,000" },
              { name: "Tennis Bracelets", image: categoryBracelets, price: "From ₹75,000" },
            ].map((item) => (
              <Link
                key={item.name}
                to="/shop?type=magic-diamonds"
                className="group relative rounded-2xl overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown-dark/80 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl font-semibold text-cream-light mb-1">
                    {item.name}
                  </h3>
                  <p className="text-accent">{item.price}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="gold" size="lg" asChild>
              <Link to="/shop?type=magic-diamonds">View All Magic Diamond Jewellery</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MagicDiamonds;
