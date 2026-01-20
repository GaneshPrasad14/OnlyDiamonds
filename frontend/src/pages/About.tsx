import { Link } from "react-router-dom";
import { Shield, Award, Gem, Users, Star, Diamond } from "lucide-react";
import { Button } from "@/components/ui/button";

import heroBanner from "@/assets/hero-banner.jpg";

const milestones = [
  { year: "1988", title: "The Beginning", description: "Founded by Mr. B. J. Prakash with a vision to bring the finest diamonds to South India." },
  { year: "1992", title: "Industry First", description: "Established the first Semi-Automatic Diamond Polishing Unit in South India." },
  { year: "2005", title: "Retail Excellence", description: "Opened our flagship showroom in Coimbatore, bringing diamonds directly to discerning customers." },
  { year: "2024", title: "Digital Transformation", description: "Launched our premium online experience, bringing luxury to your fingertips." },
];

const values = [
  {
    icon: Gem,
    title: "Unmatched Quality",
    description: "Every diamond is hand-selected and certified to meet our exacting standards.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Complete clarity in pricing, sourcing, and certification.",
  },
  {
    icon: Users,
    title: "Customer First",
    description: "Personalized service that goes beyond the transaction.",
  },
  {
    icon: Star,
    title: "Craftsmanship",
    description: "Expert artisans who bring decades of skill to every piece.",
  },
];

const About = () => {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={heroBanner} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary/70" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-accent font-medium tracking-[0.3em] uppercase mb-4">
              Our Story
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-cream-light mb-6">
              A Legacy of Brilliance Since 1988
            </h1>
            <p className="text-cream-light/80 text-lg leading-relaxed">
              For over three decades, Only Diamonds has been at the forefront of
              India's diamond industry, combining traditional craftsmanship with
              innovative excellence to create jewellery that transcends generations.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase mb-4">
                The Visionary
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
                Mr. B. J. Prakash
              </h2>
              <div className="text-foreground/80 leading-relaxed space-y-4">
                <p className="indent-8 text-justify">
                  Mr. B. J. Prakash's journey in the diamond industry began in early 1988, marking a significant milestone by introducing South India's first Semi-Automatic Diamond Polishing machine. His vision expanded rapidly, leading to the establishment of a proprietary manufacturing unit for loose diamonds from raw "Rough" material in 1991. By 1993, the company had ventured into diamond jewellery manufacturing and wholesale distribution. The legacy continued to grow with the opening of a dedicated diamond jewellery boutique in 2014, followed by a flagship retail showroom in R.S. Puram in 2016, showcasing the latest collections.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-cream rounded-2xl overflow-hidden">
                <img src="/au.png" alt="Mr. B. J. Prakash" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-accent text-brown-dark p-6 rounded-xl shadow-luxury">
                <p className="font-serif text-4xl font-bold">37+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              Our Journey
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Milestones of Excellence
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-8 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                    <span className="font-serif text-xl font-bold text-accent">
                      {milestone.year}
                    </span>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-accent/30 mt-4" />
                  )}
                </div>
                <div className="flex-1 pb-12">
                  <h3 className="font-serif text-xl font-semibold text-primary mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Our Core Values
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="text-center p-8 bg-card rounded-2xl shadow-soft hover:shadow-medium transition-all duration-500"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 mb-6">
                  <value.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            Experience the Only Diamonds Difference
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Visit our showroom in Coimbatore to discover our exquisite collections
            and experience our legendary service firsthand.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/shop">Explore Collections</Link>
            </Button>
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/contact">Book an Appointment</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
