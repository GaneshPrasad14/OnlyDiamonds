import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, RefreshCw, Check } from "lucide-react";

const policyItems = [
  {
    id: "eligibility",
    title: "Eligibility for Exchange",
    content: `Our Lifetime Exchange Policy applies to:
    
• All diamond jewellery purchased from Only Diamonds with original invoice
• Products in their original condition with no damage or alterations
• Items accompanied by original certificates (SGL/IGI) and BIS Hallmark tags
• Exchanges for items of equal or higher value
• Both Natural Diamonds and Magic Diamonds (lab-grown) collections`,
  },
  {
    id: "non-eligibility",
    title: "Non-Eligibility Conditions",
    content: `The following items are not eligible for exchange:
    
• Jewellery purchased during promotional sales with special discounts
• Custom-made or personalized pieces (unless manufacturing defect)
• Products with missing certificates, tags, or packaging
• Items that have been resized, repaired, or altered outside our stores
• Products showing signs of wear, damage, or mishandling
• Items not purchased directly from Only Diamonds authorized showrooms`,
  },
  {
    id: "qa-department",
    title: "Quality Assurance Evaluation",
    content: `All exchange requests go through our QA department:
    
• Expert gemologists examine each piece thoroughly
• Diamond quality is verified against original certificates
• Gold purity is tested and confirmed
• Overall condition of the jewellery is assessed
• Any discrepancies are documented and discussed with the customer
• Final valuation is based on current gold rates and original purchase value`,
  },
  {
    id: "requirements",
    title: "Exchange Requirements",
    content: `Please ensure you have the following:
    
• Original purchase invoice (digital or physical copy)
• Diamond certification (SGL/IGI certificate)
• BIS Hallmark card with HUID
• Original packaging (if available)
• Valid government-issued ID proof
• The jewellery must be in clean, presentable condition`,
  },
  {
    id: "timeline",
    title: "Exchange Timeline",
    content: `Our exchange process timeline:
    
• Walk-in exchanges: Same day evaluation, 1-2 hours for processing
• New piece selection: Immediate, subject to availability
• Custom orders on exchange: 15-20 working days for crafting
• Credit note validity: 6 months from date of issue
• Peak season (festivals/weddings): Please allow additional processing time
• Appointment booking recommended for faster service`,
  },
  {
    id: "refund",
    title: "Exchange Value & Refund Policy",
    content: `Understanding your exchange value:
    
• Full 100% value of your original purchase price is credited
• Gold value calculated at current market rates (may result in additional value)
• Diamond value as per original certification
• Making charges are not refundable but credited towards new purchase
• Any access amount from your exchange is issued as store credit
• Cash refunds are not available; exchange for new jewellery only
• Price difference for higher-value items must be paid at the time of exchange`,
  },
  {
    id: "procedure",
    title: "Exchange Procedure",
    content: `Step-by-step exchange process:
    
1. Visit our showroom with your jewellery and all required documents
2. Submit your piece to our QA team for evaluation
3. Receive your valuation report and exchange quote
4. Browse our collections and select your new piece
5. Pay any price difference (if applicable) or receive store credit
6. Complete documentation and take home your new jewellery
7. Retain your new invoice and certificates for future exchanges`,
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    content: `We aim for complete customer satisfaction:
    
• All disputes are handled by our senior management team
• Customers have the right to request a second evaluation
• Third-party gemological assessment available upon request (charges apply)
• Written complaints receive response within 48 working hours
• Our customer care team is available for clarification at all stages
• For unresolved disputes, customers may escalate to our Coimbatore head office`,
  },
  {
    id: "excellence",
    title: "Our Commitment to Excellence",
    content: `At Only Diamonds, we believe in:
    
• Building lifelong relationships with our customers
• Complete transparency in all our policies and pricing
• Fair valuation practices that protect your investment
• Continuous improvement based on customer feedback
• Upholding the highest standards of quality and service
• Making every exchange experience smooth and satisfying

Your trust is our most valued asset. We're honored to be part of your precious moments, generation after generation.`,
  },
];

const ExchangePolicy = () => {
  return (
    <main className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Lifetime Exchange Policy</span>
        </nav>

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-6">
            <RefreshCw className="h-4 w-4 text-accent" />
            <span className="text-accent text-sm font-medium">100% Value Exchange</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Lifetime Exchange Policy
          </h1>
          <p className="text-muted-foreground text-lg">
            Your investment is always protected. Exchange your Only Diamonds
            jewellery for full value, anytime, for life.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <div className="bg-card p-6 rounded-xl shadow-soft text-center">
            <Shield className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-1">100% Value</h3>
            <p className="text-sm text-muted-foreground">Full purchase price honored</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-soft text-center">
            <RefreshCw className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-1">Lifetime Validity</h3>
            <p className="text-sm text-muted-foreground">No time restrictions</p>
          </div>
          <div className="bg-card p-6 rounded-xl shadow-soft text-center">
            <Check className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-semibold text-primary mb-1">Hassle-Free</h3>
            <p className="text-sm text-muted-foreground">Simple, transparent process</p>
          </div>
        </div>

        {/* Policy Accordion */}
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {policyItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="bg-card rounded-xl px-6 shadow-soft border-none"
              >
                <AccordionTrigger className="text-left font-serif text-lg font-semibold text-primary hover:text-accent py-6">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/80 pb-6">
                  <div className="whitespace-pre-line leading-relaxed">
                    {item.content}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <div className="bg-primary p-12 rounded-2xl shadow-luxury">
            <h2 className="font-serif text-2xl font-bold text-cream-light mb-4">
              Have Questions About Our Exchange Policy?
            </h2>
            <p className="text-cream-light/70 mb-8">
              Our team is here to help. Contact us for any clarifications or
              to schedule your exchange visit.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="gold" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button variant="hero-outline" asChild>
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExchangePolicy;
