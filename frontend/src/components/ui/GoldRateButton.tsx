import { useState, useEffect } from "react";
import { X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export const GoldRateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [goldRates, setGoldRates] = useState([
    { type: "22KT Gold", rate: "Loading...", change: "-" },
    { type: "18KT Gold", rate: "Loading...", change: "-" },
    { type: "24KT Gold", rate: "Loading...", change: "-" },
  ]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/gold-rate");
        const data = await response.json();

        if (data && data.rates) {
          setGoldRates([
            { type: "Diamond EF, VVS", rate: `₹${data.rates["diamond_ef_vvs"] || 0}/ct`, change: "-" },
            { type: "Diamond EF, IF-VVS1", rate: `₹${data.rates["diamond_ef_if_vvs1"] || 0}/ct`, change: "-" },
            { type: "22KT Gold", rate: `₹${data.rates["22KT"] || 0}/g`, change: "-" },
            { type: "18KT Gold", rate: `₹${data.rates["18KT"] || 0}/g`, change: "-" },
            { type: "14KT Gold", rate: `₹${data.rates["14KT"] || 0}/g`, change: "-" },
            { type: "9KT Gold", rate: `₹${data.rates["9KT"] || 0}/g`, change: "-" },
          ]);
        }
      } catch (error) {
        console.error("Error fetching gold rates:", error);
      }
    };

    fetchRates();
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-4 bottom-24 z-40 flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-brown-dark px-4 py-3 rounded-full shadow-gold hover:shadow-luxury transition-all duration-300 animate-float"
      >
        <TrendingUp className="h-5 w-5" />
        <span className="font-medium text-sm hidden sm:inline">Live Rate</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-brown-dark/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative bg-cream rounded-2xl p-4 max-w-[280px] w-full shadow-luxury animate-scale-in">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center mb-3">
              <TrendingUp className="h-6 w-6 text-accent mx-auto mb-1" />
              <h2 className="font-serif text-lg text-primary">Live Rates</h2>
              <p className="text-[10px] text-muted-foreground">Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="space-y-2">
              {goldRates.map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-2 bg-background rounded-lg border border-border"
                >
                  <span className="font-medium text-xs text-foreground">{item.type}</span>
                  <div className="text-right">
                    <span className="text-sm font-serif font-bold text-primary">{item.rate}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-muted-foreground text-center mt-3 leading-tight">
              *Gold rates per gram<br />Diamond rates per carat
            </p>
          </div>
        </div>
      )}
    </>
  );
};
