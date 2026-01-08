import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config";

const GoldRateManager = () => {
    const [rates, setRates] = useState({
        "diamond_ef_vvs": "",
        "diamond_ef_if_vvs1": "",
        "22KT": "",
        "18KT": "",
        "14KT": "",
        "9KT": "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchRates();
    }, []);

    // Auto-calculate rates when 22KT changes
    useEffect(() => {
        if (rates["22KT"]) {
            const baseRate = parseFloat(rates["22KT"]);
            if (!isNaN(baseRate)) {
                // Formulae:
                // 18kt = (22kt ÷ 0.916 × 0.76)
                // 14kt = (22kt ÷ 0.916 × 0.59)
                // 9kt  = (22kt ÷ 0.916 × 0.38)
                const rate18 = Math.round((baseRate / 0.916) * 0.76);
                const rate14 = Math.round((baseRate / 0.916) * 0.59);
                const rate9 = Math.round((baseRate / 0.916) * 0.38);

                setRates(prev => ({
                    ...prev,
                    "18KT": rate18.toString(),
                    "14KT": rate14.toString(),
                    "9KT": rate9.toString()
                }));
            }
        }
    }, [rates["22KT"]]);

    const fetchRates = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/gold-rate`);
            const data = await response.json();
            if (data.rates) {
                // Merge with current/default state to ensure no keys are missing
                setRates(prev => ({
                    ...prev,
                    "diamond_ef_vvs": data.rates["diamond_ef_vvs"]?.toString() || "",
                    "diamond_ef_if_vvs1": data.rates["diamond_ef_if_vvs1"]?.toString() || "",
                    "22KT": data.rates["22KT"]?.toString() || "",
                    "18KT": data.rates["18KT"]?.toString() || "",
                    "14KT": data.rates["14KT"]?.toString() || "",
                    "9KT": data.rates["9KT"]?.toString() || "",
                }));
            }
        } catch (error) {
            console.error("Error fetching rates:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRates({ ...rates, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get token from localStorage (assuming auth flows saves it there)
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_BASE_URL}/api/v1/gold-rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ rates }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to update rates: ${response.status}`);
            }

            toast.success("Rates updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update rates. Ensure you are an admin.");
            console.error("Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-serif font-bold text-primary mb-4">Manage Live Rates</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Diamond Rates (Manual) */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Diamond Rates</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diamond EF, VVS (₹/ct)</label>
                        <Input
                            type="number"
                            name="diamond_ef_vvs"
                            value={rates["diamond_ef_vvs"]}
                            onChange={handleChange}
                            placeholder="Manual Entry"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Diamond EF, IF-VVS1 (₹/ct)</label>
                        <Input
                            type="number"
                            name="diamond_ef_if_vvs1"
                            value={rates["diamond_ef_if_vvs1"]}
                            onChange={handleChange}
                            placeholder="Manual Entry"
                            required
                        />
                    </div>
                </div>

                {/* Gold Base Rate (Manual) */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Gold Base Rate</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">22KT Gold (₹)</label>
                        <Input
                            type="number"
                            name="22KT"
                            value={rates["22KT"]}
                            onChange={handleChange}
                            placeholder="Manual Entry - Auto calc others"
                            required
                            className="border-accent ring-1 ring-accent/20"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Entering this will auto-calculate 18KT, 14KT, and 9KT.
                        </p>
                    </div>
                </div>

                {/* Auto Calculated Rates */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">Auto-Calculated Rates</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">18KT Gold (₹)</label>
                        <Input
                            type="number"
                            name="18KT"
                            value={rates["18KT"]}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">14KT Gold (₹)</label>
                        <Input
                            type="number"
                            name="14KT"
                            value={rates["14KT"]}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">9KT Gold (₹)</label>
                        <Input
                            type="number"
                            name="9KT"
                            value={rates["9KT"]}
                            readOnly
                            className="bg-gray-50"
                        />
                    </div>
                </div>

                <Button type="submit" disabled={loading} className="md:col-span-2 lg:col-span-3 mt-4">
                    {loading ? "Updating..." : "Update All Rates"}
                </Button>
            </form>
        </div>
    );
};

export default GoldRateManager;
