import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Calendar } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-accent transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visit our showroom, book an appointment, or reach out to our team.
            We're here to help you find the perfect diamond.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            {/* Visit Card */}
            <div className="bg-card p-8 rounded-2xl shadow-soft">
              <MapPin className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                Visit Our Showroom
              </h3>
              <p className="text-foreground/80 mb-2">Only Diamonds</p>
              <p className="text-muted-foreground text-sm">
                167, Thiruvenkatasamy Road (W),<br />
                R.S.Puram, Coimbatore,<br />
                Tamil Nadu - 641002
              </p>
            </div>

            {/* Hours Card */}
            <div className="bg-card p-8 rounded-2xl shadow-soft">
              <Clock className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                Store Hours
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Saturday</span>
                  <span className="text-foreground">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-foreground">On Appointment</span>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-card p-8 rounded-2xl shadow-soft">
              <Phone className="h-8 w-8 text-accent mb-4" />
              <h3 className="font-serif text-xl font-semibold text-primary mb-4">
                Contact Details
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+919786123450"
                  className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  +91 97861 23450
                </a>
                <a
                  href="https://wa.me/919786123450"
                  className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors"
                >
                  <FaWhatsapp className="h-4 w-4" />
                  WhatsApp Us
                </a>
                <a
                  href="mailto:vicky.onlydiamonds@gmail.com"
                  className="flex items-center gap-3 text-foreground/80 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  vicky.onlydiamonds@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card p-8 lg:p-12 rounded-2xl shadow-soft">
              <h2 className="font-serif text-2xl font-semibold text-primary mb-2">
                Book an Appointment
              </h2>
              <p className="text-muted-foreground mb-8">
                Schedule a personalized consultation with our diamond experts.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="+91 97861 23450"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select a subject</option>
                      <option value="consultation">Diamond Consultation</option>
                      <option value="custom">Custom Jewellery</option>
                      <option value="bridal">Bridal Collection</option>
                      <option value="support">Customer Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Select a time</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="19:00">7:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Your Message</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <Button type="submit" variant="hero" size="xl" className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Appointment
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-card rounded-2xl overflow-hidden shadow-soft">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.6026607383087!2d76.9459148748085!3d11.009940789153394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8591c49d77259%3A0x136a61ca4b404e1e!2sONLY%20DIAMONDS%20-%20Jewellery%20Showroom!5e1!3m2!1sen!2sin!4v1767979843159!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Only Diamonds Showroom Location"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
