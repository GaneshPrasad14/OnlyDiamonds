import { useState, useEffect } from "react";
import { X, HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ConstructionPopup = () => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // Check if we've shown this in the current session
        const hasShown = sessionStorage.getItem("construction-popup-shown");
        if (!hasShown) {
            // Small delay for better UX
            const timer = setTimeout(() => setOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        sessionStorage.setItem("construction-popup-shown", "true");
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md text-center p-8">
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <HardHat className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-primary mb-2">
                    Site Under Construction
                </h2>
                <p className="text-muted-foreground mb-6">
                    Welcome to Only Diamonds! We are currently fine-tuning our website to provide you with the best experience. You are welcome to browse and place orders via WhatsApp.
                </p>
                <div className="flex flex-col gap-2">
                    <Button onClick={handleClose} className="w-full">
                        Enter Site
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ConstructionPopup;
