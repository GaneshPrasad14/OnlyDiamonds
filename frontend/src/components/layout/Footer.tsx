import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Instagram } from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Earrings", href: "/shop?category=earrings" },
    { name: "Rings", href: "/shop?category=rings" },
    { name: "Bangles and Bracelet", href: "/shop?category=bangles-and-bracelet" },
    { name: "Solitaires", href: "/shop?category=solitaires" },
    { name: "Necklace", href: "/shop?category=necklace" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Know Your Diamonds", href: "/know-diamonds" },
    { name: "Magic Diamonds", href: "/magic-diamonds" },
    { name: "Exchange Policy", href: "/exchange-policy" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "FAQ", href: "/faq" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <img
                src="/logo.png"
                alt="Only Diamonds Logo"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-primary-foreground/70 mb-6 max-w-md leading-relaxed">
              For over 37 years, we've been crafting exquisite diamond jewellery that
              celebrates life's precious moments. Every piece tells a story of elegance,
              craftsmanship, and timeless beauty.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/onlydiamondsjewellery?utm_source=qr&igsh=N25oOHZhbXJiMTM1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-primary-foreground/10 hover:bg-accent hover:text-brown-dark transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-6 text-accent">Visit Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <p className="text-primary-foreground/70 text-sm">
                  123 Diamond Street,<br />
                  Coimbatore, Tamil Nadu<br />
                  India - 641001
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent" />
                <a
                  href="tel:+919876543210"
                  className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent" />
                <a
                  href="mailto:hello@onlydiamonds.com"
                  className="text-primary-foreground/70 hover:text-accent transition-colors text-sm"
                >
                  hello@onlydiamonds.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © 2025 Only Diamonds. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                alt="Mastercard"
                className="h-6 opacity-60 hover:opacity-100 transition-opacity"
              />
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                alt="Visa"
                className="h-4 opacity-60 hover:opacity-100 transition-opacity"
              />
              <span className="text-xs text-primary-foreground/40">Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
