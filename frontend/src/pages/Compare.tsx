import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calculator } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

interface DiamondSlab {
    _id: string;
    name: string;
    vvsPrice: number;
}

interface TaxCharge {
    karat: string;
    vatPercent: number;
    makingChargePerGram: number;
    vaPercent: number;
}

interface ColorStone {
    _id: string;
    type: string;
    pricePerCarat: number;
}

const Compare = () => {
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);

    // Data from Backend
    const [goldRates, setGoldRates] = useState<any>(null);
    const [diamondSlabs, setDiamondSlabs] = useState<DiamondSlab[]>([]);
    const [taxCharges, setTaxCharges] = useState<TaxCharge[]>([]);
    const [colorStones, setColorStones] = useState<ColorStone[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        grossWeight: "",
        purity: "22KT",
        stoneWeight: "",
        stoneType: ""
    });

    // Diamond Rows (Fixed 3 rows for first 3 slabs)
    const [diamondRows, setDiamondRows] = useState<{ slabId: string, weight: string, count: string }[]>([]);

    const [result, setResult] = useState<number | null>(null);
    const [breakdown, setBreakdown] = useState<any>(null);

    // Auth State
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [pendingCalculation, setPendingCalculation] = useState(false);

    useEffect(() => {
        if (user && pendingCalculation) {
            performCalculation();
            setPendingCalculation(false);
        }
    }, [user, pendingCalculation]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Default mock slabs in case of API failure or empty data
            // Exact order requested: 1 to 4, below 1, 4.50 to 7
            const defaultSlabs = [
                { _id: "slab1", name: "1 to 4 cents", vvsPrice: 80000 },
                { _id: "slab2", name: "Below 1 cent", vvsPrice: 50000 },
                { _id: "slab3", name: "4.50 to 7 cents", vvsPrice: 120000 }
            ];

            let rates = null;
            let slabs: DiamondSlab[] = [];
            let taxes: TaxCharge[] = [];
            let stones: ColorStone[] = [];

            try {
                const [ratesRes, slabsRes, taxRes, stonesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/gold-rate`),
                    fetch(`${API_BASE_URL}/api/diamond-slabs`),
                    fetch(`${API_BASE_URL}/api/tax-charges`),
                    fetch(`${API_BASE_URL}/api/color-stones`)
                ]);

                if (ratesRes.ok) rates = await ratesRes.json();
                if (slabsRes.ok) slabs = await slabsRes.json();
                if (taxRes.ok) taxes = await taxRes.json();
                if (stonesRes.ok) stones = await stonesRes.json();
            } catch (err) {
                console.error("Partial or full API failure", err);
            }

            // Fallback for slabs if empty
            if (!slabs || slabs.length === 0) {
                console.warn("Using default diamond slabs due to missing API data");
                slabs = defaultSlabs;
            }

            // Force the slabs to be exactly these three in this order if possible
            // If API returns data, we try to map it, but the user requested specific structure.
            // For now, I will use the defaultSlabs as the "Structure" and try to fill prices from API if name matches.
            // But since "4.50 to 7" is new, API might not have it.
            // Recommendation: Use defaultSlabs as the source of truth for NAMES and ORDER.

            const structuredSlabs = defaultSlabs.map(dSlab => {
                // Try to find a matching slab in API response to get updated price
                const match = slabs.find(s => s.name.toLowerCase() === dSlab.name.toLowerCase() ||
                    (dSlab.name.includes("Below 1") && s.name.includes("Below 1")) ||
                    (dSlab.name.includes("4.50") && s.name.includes("4.50")) ||
                    (dSlab.name.includes("1 to 4") && s.name.includes("1 to 4")));
                return match ? { ...dSlab, vvsPrice: match.vvsPrice } : dSlab;
            });

            // Filter Color Stones to only "Synthetic"
            const filteredStones = stones.filter(s => s.type === 'Synthetic');
            const finalStones = filteredStones.length > 0 ? filteredStones : [{ _id: 'default_syn', type: 'Synthetic', pricePerCarat: 5000 }]; // Fallback if no Synthetic found

            setGoldRates(rates?.rates || null);
            setDiamondSlabs(structuredSlabs);
            setTaxCharges(taxes || []);
            setColorStones(finalStones);

            // Initialize diamond rows with all 3 slabs
            const initialRows = structuredSlabs.map((slab: DiamondSlab) => ({
                slabId: slab._id,
                weight: "",
                count: ""
            }));

            setDiamondRows(initialRows);

            if (finalStones.length > 0) {
                setFormData(prev => ({ ...prev, stoneType: finalStones[0].type }));
            }

        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error("Failed to load live rates");
        } finally {
            setLoading(false);
        }
    };

    const handleDiamondChange = (index: number, field: string, value: string) => {
        const newRows = [...diamondRows];
        (newRows[index] as any)[field] = value;
        setDiamondRows(newRows);
    };

    const handleCalculateClick = (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            setPendingCalculation(true);
            setIsAuthModalOpen(true);
            return;
        }

        performCalculation();
    };

    const performCalculation = () => {
        setCalculating(true);
        setResult(null);

        try {
            // 1. Calculate Weights
            const grossWeight = parseFloat(formData.grossWeight) || 0;

            // Calculate Total Stone Weight in carats
            let totalDiamondCarats = 0;
            diamondRows.forEach(row => {
                totalDiamondCarats += parseFloat(row.weight) || 0;
            });
            const stoneCarats = parseFloat(formData.stoneWeight) || 0;

            // Convert carats to grams (1 carat = 0.2 grams)
            const stonesWeightGrams = (totalDiamondCarats + stoneCarats) * 0.2;

            // Net Weight = Gross Weight - Stone Weight
            const netWeight = Math.max(0, grossWeight - stonesWeightGrams);

            // 2. Gold Price (on Net Weight)
            const purityKey = formData.purity; // e.g., "22KT"
            const goldRate = goldRates ? goldRates[purityKey] : 0;
            const goldCost = netWeight * goldRate;

            // 3. Making Charges (on Net Weight)
            const taxCharge = taxCharges.find(t => t.karat.toLowerCase() === purityKey.toLowerCase());
            const makingChargeRate = taxCharge ? taxCharge.makingChargePerGram : 0;
            const makingCost = netWeight * makingChargeRate;

            // 4. Diamond Cost
            let diamondCost = 0;
            diamondRows.forEach(row => {
                const slab = diamondSlabs.find(s => s._id === row.slabId);
                const weight = parseFloat(row.weight) || 0;
                if (slab) {
                    diamondCost += weight * slab.vvsPrice;
                }
            });

            // 5. Color Stone Cost
            let stoneCost = 0;
            const stone = colorStones.find(s => s.type === formData.stoneType);
            if (stone) {
                stoneCost = stoneCarats * stone.pricePerCarat;
            }

            // 6. Value Addition (V.A) - Fetch from dashboard (default 25 if not found)
            const vaPercent = taxCharge ? taxCharge.vaPercent : 25;
            const vaCost = goldCost * (vaPercent / 100);

            // 7. Sub Total
            const subTotal = goldCost + diamondCost + stoneCost + vaCost + makingCost;

            // 8. Tax (GST 3%)
            const gstPercent = 3;
            const gstCost = subTotal * (gstPercent / 100);

            // 9. Grand Total
            const total = subTotal + gstCost;

            setResult(Math.round(total));
            setBreakdown({
                purity: purityKey,
                goldRate,
                grossWeight,
                netWeight,
                goldCost,
                makingChargeRate,
                makingCost,
                diamondCost,
                stoneCost,
                vaPercent,
                vaCost,
                subTotal,
                gstPercent,
                gstCost
            });

        } catch (error) {
            console.error(error);
            toast.error("Error calculating price");
        } finally {
            setCalculating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-cream/20 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <p className="text-accent font-medium tracking-[0.2em] uppercase mb-3">
                        Transparent Pricing
                    </p>
                    <h1 className="font-serif text-3xl md:text-5xl font-bold text-primary mb-4">
                        Price Estimator
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Calculate the estimated price of your dream jewellery using real-time gold and diamond rates.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <Card className="border-accent/10 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-serif text-2xl">Enter Details</CardTitle>
                            <CardDescription>Fill in the specifications below</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCalculateClick} className="space-y-6">
                                {/* Gold Details */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-primary border-b border-border pb-2">Gold Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Gross Weight (gms)</Label>
                                            <Input
                                                type="number"
                                                step="0.001"
                                                placeholder="e.g. 10.500"
                                                value={formData.grossWeight}
                                                onChange={(e) => setFormData({ ...formData, grossWeight: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Purity</Label>
                                            <Select
                                                value={formData.purity}
                                                onValueChange={(val) => setFormData({ ...formData, purity: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="22KT">22KT</SelectItem>
                                                    <SelectItem value="18KT">18KT</SelectItem>
                                                    <SelectItem value="14KT">14KT</SelectItem>
                                                    <SelectItem value="9KT">9KT</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                {/* Diamond Details */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-primary border-b border-border pb-2">Diamond Details (Quality: EF, VVS)</h3>
                                    <div className="space-y-3">
                                        {diamondRows.length > 0 ? (
                                            diamondRows.map((row, index) => {
                                                const slab = diamondSlabs.find(s => s._id === row.slabId);
                                                return (
                                                    <div key={row.slabId} className="grid grid-cols-12 gap-2 items-center text-sm">
                                                        <div className="col-span-4 font-medium text-muted-foreground">
                                                            {slab?.name || "Unknown Slab"}
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="Cts"
                                                                value={row.weight}
                                                                onChange={(e) => handleDiamondChange(index, 'weight', e.target.value)}
                                                                className="h-8"
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Input
                                                                type="number"
                                                                placeholder="Qty"
                                                                value={row.count}
                                                                onChange={(e) => handleDiamondChange(index, 'count', e.target.value)}
                                                                className="h-8"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-sm text-red-500">
                                                Unable to load diamond slabs. Please try again later.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Color Stone Details */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-primary border-b border-border pb-2">Color Stone</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Weight (cts)</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={formData.stoneWeight}
                                                onChange={(e) => setFormData({ ...formData, stoneWeight: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Type</Label>
                                            <Select
                                                value={formData.stoneType}
                                                onValueChange={(val) => setFormData({ ...formData, stoneType: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {colorStones.map(stone => (
                                                        <SelectItem key={stone._id} value={stone.type}>{stone.type}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full text-lg h-12" disabled={calculating}>
                                    {calculating ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Calculating...</>
                                    ) : (
                                        <><Calculator className="mr-2 h-5 w-5" /> Calculate Price</>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Result Card */}
                    <div className="space-y-6">
                        <Card className="bg-primary text-cream-light border-none shadow-xl h-full flex flex-col justify-center relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                            <CardContent className="relative z-10 flex flex-col items-center justify-center py-12 text-center space-y-6">
                                {result !== null ? (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <p className="text-accent tracking-widest uppercase text-sm font-medium mb-2">Estimated Price</p>
                                        <div className="text-5xl md:text-6xl font-serif font-bold text-cream mb-2">
                                            ₹{result.toLocaleString()}
                                        </div>
                                        <p className="text-cream/60 text-sm">*Inclusive of all taxes</p>

                                        {breakdown && (
                                            <div className="mt-8 p-4 bg-black/20 rounded-lg text-sm text-left space-y-2 w-full max-w-xs mx-auto backdrop-blur-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-cream/70">Gold ({breakdown.purity}):</span>
                                                    <span>₹{Math.round(breakdown.goldCost).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-cream/70">Diamonds:</span>
                                                    <span>₹{Math.round(breakdown.diamondCost).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-cream/70">Color stone:</span>
                                                    <span>₹{Math.round(breakdown.stoneCost).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-cream/70">V.A:</span>
                                                    <span>₹{Math.round(breakdown.vaCost).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-cream/70">Making:</span>
                                                    <span>₹{Math.round(breakdown.makingCost).toLocaleString()}</span>
                                                </div>
                                                <div className="border-t border-cream/10 pt-2 border-b pb-2 flex justify-between font-medium text-cream">
                                                    <span>Sub Total:</span>
                                                    <span>₹{Math.round(breakdown.subTotal).toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between font-medium text-accent">
                                                    <span>GST ({breakdown.gstPercent}%):</span>
                                                    <span>₹{Math.round(breakdown.gstCost).toLocaleString()}</span>
                                                </div>
                                                <div className="text-xs text-center pt-2 text-cream/50">
                                                    Net Wt: {breakdown.netWeight.toFixed(3)}g
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="text-cream/40">
                                        <Calculator className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg">Enter details to see the price breakdown</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div >
    );
};

export default Compare;
