import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSlider from "@/components/ui/HeroSlider";

import mymBanner1 from "@/assets/MYM/MYM Banner 1.jpg";
import mymBanner2 from "@/assets/MYM/MYM Banner 2.jpg";
import mymBanner3 from "@/assets/MYM/MYM Banner 3.jpg";
import mymBanner4 from "@/assets/MYM/MYM Banner 4.jpg";

import mymThinking from "@/assets/MYM/MYM 1 - Thinking.jpg";
import mymCreating from "@/assets/MYM/MYM 2 - Creating Design.jpg";
import mym3dDesigning from "@/assets/MYM/MYM 3 - 3D Designing.jpg";
import mymFinishing from "@/assets/MYM/MYM 4 - Finishing Product.jpg";
import mymCertificate from "@/assets/MYM/MYM 5 - Diamond Certificate.jpg";

const mymBanners = [
  mymBanner1,
  mymBanner2,
  mymBanner3,
  mymBanner4,
];

const customizationSteps = [
  {
    step: 1,
    title: "Thinking",
    content: "Are you thinking to create your unique diamond jewellery rather than picking up a random design in some store. Do not compromise while buying a diamond jewellery. We create a unique design for you and it's just only for you. There is no second piece made on such creations and at no extra cost.",
    image: mymThinking,
  },
  {
    step: 2,
    title: "Creating Design",
    content: "We design multiple 2D design concepts based on your requirement for you to choose the best among that. You can customize the designs as per your choice and requirement. Color options, Detachable options and so on. We design with aesthetics and conceptual way that suits you in the latest trend, which fits even your pocket.",
    image: mymCreating,
  },
  {
    step: 3,
    title: "3D Designing",
    content: "We create a 3D CAD design of your final design that you choose and show you a complete structure of how the actual product will be. Can visualize in detail of the design flow, shape and actual size of the product. At this stage, any alterations in the design is possible. After approval of the CAD design, we proceed on to the next step and print this design to a 3D prototype with is then processed into gold. You can able to experience each and every stage of the progress in the manufacturing of your beautiful masterpiece.",
    image: mym3dDesigning,
  },
  {
    step: 4,
    title: "Finishing Product",
    content: "Once the prototype is converted into gold, we proceed on to fixing the individual parts of the jewellery into the actual product and give it a physical shape while processing through the multiple stages of manufacturing process like Filing, Pre-Polishing, Diamond Setting, Final Polishing, Electro-plating, Rhodium plating and thus the product is ready. The product at each and every stage of the manufacturing process is undergone for Quality Check to ensure its proper finish and durability.",
    image: mymFinishing,
  },
  {
    step: 5,
    title: "Diamond Certificate",
    content: "Once the product is completely ready, it is then submitted to the international laboratories like SGL/IGI/Other if any particular request from the customer. The LAB checks the quality of the diamonds that is fixed in the product, under microscope and examines the Color, Clarity, Cut and Finish of the product and certifies it to the actuals. When it comes to Diamond Jewellery, the highest quality is 'EF color and IF-VVS1 clarity'. Only a very few stores will deal in this quality as it is very rare and expensive than the regular quality 'EF color and VVS clarity' which is commonly available in most of the stores in south india.",
    image: mymCertificate,
  },
];


const Customize = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cream to-background">
      {/* Hero Slider */}
      <HeroSlider images={mymBanners} className="h-screen" />

      <div className="container mx-auto px-4 lg:px-8 mt-16">
        {/* Breadcrumb - Moved below slider */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Customize Your Jewellery</span>
        </nav>

        {/* Customization Steps */}
        <div className="space-y-16">
          {customizationSteps.map((step, index) => (
            <div key={step.step} className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className={index % 2 !== 0 ? "lg:order-2" : "lg:order-1"}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-brown-dark font-bold text-xl">
                      {step.step}
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-primary">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    {step.content}
                  </p>
                </div>
                <div className={`relative ${index % 2 !== 0 ? "lg:order-1" : "lg:order-2"}`}>
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto rounded-2xl shadow-luxury"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center pb-16">
          <h2 className="font-serif text-3xl font-bold text-primary mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our expert designers to begin creating your unique piece of jewellery.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">Get Started</Link>
            </Button>
            <Button variant="gold-outline" size="lg">
              📞 Call +91 98765 43210
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Customize;
