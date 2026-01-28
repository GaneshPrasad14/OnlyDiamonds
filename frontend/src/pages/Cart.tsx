import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";

const Cart = () => {
    const { cartItems, removeFromCart } = useShop();

    const calculateTotal = () => {
        // This is a simple parser, real world would use numbers
        return cartItems.reduce((acc, item) => {
            const price = parseFloat(item.price.replace(/[₹,]/g, ''));
            return acc + price;
        }, 0);
    };

    const total = calculateTotal();
    const tax = total * 0.03; // 3% GST

    if (cartItems.length === 0) {
        return (
            <main className="pt-24 pb-16 min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-serif font-bold text-primary mb-2">Your Cart is Empty</h1>
                <p className="text-muted-foreground mb-6">Looks like you haven't added any unique pieces yet.</p>
                <Button variant="hero" asChild>
                    <Link to="/shop">Start Shopping</Link>
                </Button>
            </main>
        );
    }

    return (
        <main className="pt-24 pb-16 min-h-screen bg-background font-serif">
            <div className="container mx-auto px-4 lg:px-8">
                <h1 className="text-3xl font-bold text-primary mb-8">Shopping Cart ({cartItems.length})</h1>

                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map((item, idx) => (
                            <div key={`${item.id}-${idx}`} className="flex gap-4 p-4 bg-card rounded-xl border border-border/50">
                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-primary">{item.name}</h3>
                                    <p className="text-lg font-bold text-primary mb-1">{item.price}</p>
                                    <div className="text-sm text-muted-foreground space-y-1">
                                        {item.metal && <p>Metal: {item.metal}</p>}
                                        {item.diamond && <p>Diamond: {item.diamond}</p>}
                                        {item.stone && <p>Stone: {item.stone}</p>}
                                        {item.size && <p>Size: {item.size}</p>}
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 self-start">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-card p-6 rounded-xl border border-border/50 sticky top-24">
                            <h3 className="text-xl font-bold text-primary mb-4">Order Summary</h3>
                            <div className="space-y-3 text-sm mb-6">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">₹{total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">GST (3%)</span>
                                    <span className="font-medium">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="pt-3 border-t border-border flex justify-between text-base font-bold text-primary">
                                    <span>Total</span>
                                    <span>₹{(total + tax).toLocaleString()}</span>
                                </div>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white" size="lg" asChild>
                                <Link to="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Cart;
