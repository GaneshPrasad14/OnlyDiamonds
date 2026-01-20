import { useState } from "react";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { ChevronLeft, ShoppingBag } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";

const Checkout = () => {
    const { cartItems } = useShop();
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        pincode: ""
    });

    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => {
            const price = parseFloat(item.price.replace(/[₹,]/g, ''));
            return acc + price;
        }, 0);
    };

    const total = calculateTotal();
    const tax = total * 0.03;
    const finalTotal = total + tax;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.address) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Format Order Message
        let message = `*New Order Request*\n`;
        message += `----------------\n`;
        message += `Customer: ${formData.name}\n`;
        message += `Phone: ${formData.phone}\n`;
        message += `Address: ${formData.address}, ${formData.city} - ${formData.pincode}\n\n`;

        message += `*Items:*\n`;
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            if (item.metal) message += `   Metal: ${item.metal}\n`;
            if (item.diamond) message += `   Diamond: ${item.diamond}\n`;
            if (item.stone) message += `   Stone: ${item.stone}\n`;
            if (item.size) message += `   Size: ${item.size}\n`;
            message += `   Price: ${item.price}\n\n`;
        });

        message += `----------------\n`;
        message += `*Grand Total: ₹${finalTotal.toLocaleString()}*\n`;
        message += `----------------\n`;
        message += `Please confirm availability and payment details.`;

        // Encode and Open WhatsApp
        const encodedMessage = encodeURIComponent(message);
        // Replace with the business phone number. Using a placeholder or user's number if self-texting.
        const phoneNumber = "919786123450"; // Updated per user request
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        toast.success("Redirecting to WhatsApp to complete your order!");
    };

    if (cartItems.length === 0) {
        return (
            <main className="pt-32 pb-16 min-h-screen bg-background flex flex-col items-center justify-center text-center px-4 font-serif">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold text-primary mb-2">Your Cart is Empty</h1>
                <Button variant="hero" asChild>
                    <Link to="/shop">Start Shopping</Link>
                </Button>
            </main>
        );
    }

    return (
        <main className="pt-28 pb-16 min-h-screen bg-background font-serif text-primary">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
                <Link to="/cart" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Cart
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Checkout Form */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                            <p className="text-muted-foreground">Please enter your details to place the order.</p>
                        </div>

                        <form onSubmit={handlePlaceOrder} className="space-y-6">
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="border-primary/20 focus-visible:ring-accent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number *</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        placeholder="+91 97861 23450"
                                        required
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="border-primary/20 focus-visible:ring-accent"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        placeholder="Street address, Apartment, etc."
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="border-primary/20 focus-visible:ring-accent"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            placeholder="Mumbai"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="border-primary/20 focus-visible:ring-accent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pincode">Pincode *</Label>
                                        <Input
                                            id="pincode"
                                            name="pincode"
                                            placeholder="400001"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="border-primary/20 focus-visible:ring-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" size="xl" className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none">
                                <FaWhatsapp className="w-5 h-5 mr-2" />
                                Place Order on WhatsApp
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                You will be redirected to WhatsApp to send your order details to our team.
                            </p>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:pl-8 lg:border-l border-primary/10">
                        <div className="bg-card p-6 rounded-xl border border-primary/10 sticky top-28">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-4 max-h-[400px] overflow-auto pr-2 mb-6 scrollbar-thin">
                                {cartItems.map((item, idx) => (
                                    <div key={`${item.id}-${idx}`} className="flex gap-4 py-3 border-b border-dashed border-primary/10 last:border-0">
                                        <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-sm font-bold text-accent">{item.price}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.metal && `${item.metal} Gold`}
                                                {item.diamond && `, ${item.diamond}`}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-primary/10">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">GST (3%)</span>
                                    <span>₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-primary/10">
                                    <span>Total</span>
                                    <span>₹{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Checkout;
