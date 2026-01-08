import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Gem, Sparkles, Shield, Eye, Star, Award, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/ui/HeroSlider";

import lifecycle1 from "@/assets/lifecycle (1).jpg";
import lifecycle2 from "@/assets/lifecycle (2).jpg";
import lifecycle3 from "@/assets/lifecycle (3).jpg";
import lifecycle4 from "@/assets/lifecycle (4).jpg";
import lifecycle5 from "@/assets/lifecycle (5).jpg";
import lifecycle6 from "@/assets/lifecycle (6).jpg";
import lifecycle7 from "@/assets/lifecycle (7).jpg";
import lifecycle8 from "@/assets/lifecycle (8).jpg";
import lifecycle9 from "@/assets/lifecycle (9).jpg";

// Images for the Hero Slider (formerly Journey section)
const sliderImages = [
  lifecycle8, // Mines
  lifecycle7, // Rough Diamonds
  lifecycle6, // Sawing
  lifecycle5, // Polishing
  lifecycle4, // Grading
];

import kydCut from "@/assets/KYD/KYD 1 - Diamond Cut.jpg";
import kydColor from "@/assets/KYD/KYD 2 - Diamond Color.jpg";
import kydClarity from "@/assets/KYD/KYD 3 - Diamond Clarity.jpg";
import kydCarat from "@/assets/KYD/KYD 4 - Diamond Carat.jpg";
import kydCertificate from "@/assets/KYD/KYD 5 - Diamond Certificate.jpg";
import kydShapes from "@/assets/KYD/KYD 6 - Diamond Shapes.jpg";
import kydBuyingGuide from "@/assets/KYD/KYD 7 - Diamond Buying Guide.jpg";

const diamondEducation = [
  {
    title: "Diamond CUT",
    content: "A diamond's cut refers to how well-proportioned the dimensions of a diamond are, and how these surfaces, or facets, are positioned to create sparkle and brilliance. No single diamond is perfect for everyone - but all of our customers, whether they're eyeing a 0.01 carat or a 1.00 carat diamond, want as much sparkle. Of the 4Cs (cut, color, clarity, carat), cut has the greatest influence on a diamond's beauty and sparkle. Even a diamond with a flawless clarity grade (no blemishes or inclusions) can look glassy or dull if the cut is too shallow or deep. So, when determining what diamond to buy, go with the best cut grade (Ideal/Excellent) that you can afford.",
    image: kydCut,
  },
  {
    title: "Diamond COLOR",
    content: "Color refers to the natural tint inherent in white diamonds. In nature, most white diamonds have a slight tint of yellow. The closer to being 'colorless' a diamond is, the rarer it is. The industry standard for grading color is to evaluate each stone against a master set and assign a letter grade from 'D' (colorless) to 'Z' (light yellow). D,E,F color of a diamond falls under colorless category and is the most preferred.",
    image: kydColor,
  },
  {
    title: "Diamond CLARITY",
    content: "Diamond clarity is a measure of the purity and rarity of the stone, graded by the visibility of the characteristics under 10-power magnification. A diamond's clarity grade evaluates how clean a diamond is from both inclusions and blemishes. When grading the clarity of a diamond, the lab determines the relative visibility of the inclusions in a diamond and their impact on the overall visual appearance. Clarity grade is determined on a scale of decreasing clarity from the highest clarity (Flawless or FL) to the lowest clarity (Included 3, or I3).",
    image: kydClarity,
  },
  {
    title: "Diamond Carat",
    content: "The term carat refers to a diamond's weight. A Carat weight is not related to sparkle. Beautiful sparkle is the result of a well-crafted cut. In fact, a high carat weight diamond with a poor cut may look smaller than a diamond with a smaller carat weight and a very good cut. Diamonds with higher carat weights are cut from larger rough crystals that are harder to source than small crystals. So, the relationship between carat weight and price depends on the rarity or availability of a rough crystal. The term carat comes from the ancient method of weighing precious metal and stones against the seeds of the carob tree—which were considered to be even in weight. It wasn't until 1907, at the Fourth General Conference on Weights and Measures, when it was agreed upon that one diamond carat would be equal to 200 mg, or .2 grams, of a diamond. Carats can also be measured in points; 100 points equals a full carat.",
    image: kydCarat,
  },
  {
    title: "CERTIFICATE",
    content: "Diamond reports and certifications can provide the full information on a diamond's cut, color, clarity and carat weight. Unbiased diamond grading reports are offered with every Diamond Jewellery purchased from Only Diamonds. At Only Diamonds, we provide two varieties of diamond jewellery. First is EF color and IF-VVS1 clarity which actually is the highest quality in diamond jewellery certified by international lab and the next is EF color and VVS clarity which is commonly available all over south india.",
    image: kydCertificate,
  },
  {
    title: "Diamond SHAPES",
    content: "The shape of a Diamond refers to its physical structure as they are available in assorted shapes starting from classic round shape to a fancy pear cut diamond. It is important to study and identify the attributes of the different shapes of a diamond to make the right choice before making a purchase. The physical structure or the form adds to the beauty or appearance of the diamond. Shaping or cutting a diamond is considered an art as the brilliance and sparkle of the diamond is based on the cut.",
    image: kydShapes,
  },
  {
    title: "Diamond Buying Guide",
    content: "While buying a Diamond Jewellery, there are few important things to know • Choose a jeweller who has good knowledge and experience in diamonds and jewellery. Prefer a direct manufacturer rather than a trader/wholesaler. • Get the knowledge in the Diamond Cut and choose the diamonds with Excellent cut grade, as the cut is the most important in diamonds from the 4C's. • Color and Clarity : Prefer the colorless diamonds E-F and flawless diamonds IF-VVS1 certified jewellery. Buy diamond jewellery with a proper international laboratory certificate.",
    image: kydBuyingGuide,
  },
];

const KnowDiamonds = () => {
  return (
    <main className="min-h-screen">

      {/* Hero Slider Section (Replaces Journey) */}
      <HeroSlider images={sliderImages} className="h-screen" />

      {/* Diamond Education */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
              Diamond Education
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
              Know Your Diamonds
            </h2>
          </div>

          <div className="space-y-16">
            {diamondEducation.map((item, index) => (
              <div key={index} className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className={index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}>
                    <h3 className="font-serif text-3xl font-bold text-primary mb-6">
                      {index + 1}. {item.title}
                    </h3>
                    <p className="text-foreground/80 leading-relaxed text-lg">
                      {item.content}
                    </p>
                  </div>
                  <div className={`relative ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto rounded-2xl shadow-luxury"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-accent font-medium tracking-[0.2em] uppercase mb-4">
                Trust & Authenticity
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">
                Certified Excellence
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Every diamond at Only Diamonds comes with certification from
                internationally recognized gemological laboratories. This ensures
                you receive exactly what you pay for.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                  <Shield className="h-10 w-10 text-accent shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">SGL Certified</h4>
                    <p className="text-sm text-muted-foreground">
                      Solitaire Gemmological Laboratories - India's trusted lab
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                  <Award className="h-10 w-10 text-accent shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">IGI Certified</h4>
                    <p className="text-sm text-muted-foreground">
                      International Gemological Institute - Global recognition
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-card rounded-xl">
                  <Star className="h-10 w-10 text-accent shrink-0" />
                  <div>
                    <h4 className="font-semibold text-primary">BIS Hallmark with HUID</h4>
                    <p className="text-sm text-muted-foreground">
                      Bureau of Indian Standards - Guaranteed purity
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-cream p-12 rounded-2xl text-center">
              <Gem className="h-24 w-24 text-accent mx-auto mb-6" />
              <h3 className="font-serif text-2xl font-bold text-primary mb-4">
                Your Diamond, Verified
              </h3>
              <p className="text-muted-foreground mb-8">
                Scan the QR code on your certificate to verify authenticity instantly.
              </p>
              <Button variant="luxury" asChild>
                <Link to="/shop">Shop Certified Diamonds</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Ethical Sourcing */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Leaf className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream-light mb-6">
              Ethically Sourced, Responsibly Crafted
            </h2>
            <p className="text-cream-light/70 text-lg mb-8 leading-relaxed">
              We are committed to ethical practices throughout our supply chain.
              All our diamonds are conflict-free and sourced from responsible
              mining operations that prioritize environmental sustainability
              and fair labor practices.
            </p>
            <Button variant="gold" size="lg" asChild>
              <Link to="/about">Learn About Our Commitment</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Find Your Perfect Diamond?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our diamond experts are here to guide you through every step of
            your journey. Book a consultation today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/shop">Explore Collection</Link>
            </Button>
            <Button variant="gold-outline" size="lg" asChild>
              <Link to="/contact">Speak to an Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default KnowDiamonds;

