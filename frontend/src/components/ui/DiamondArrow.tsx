import React, { forwardRef } from "react"; // Added React and forwardRef
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiamondArrowProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    direction: "left" | "right";
    className?: string;
    iconClassName?: string;
}

export const DiamondArrow = forwardRef<HTMLButtonElement, DiamondArrowProps>(({ direction, className, iconClassName, ...props }, ref) => {
    return (
        <button
            ref={ref}
            type="button"
            className={cn(
                "relative flex items-center justify-center w-12 h-12 transition-transform hover:scale-110 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                className
            )}
            {...props}
        >
            {/* Diamond Background */}
            <img
                src="/diamond-nav-transparent.png"
                alt="nav"
                className={cn(
                    "absolute inset-0 w-full h-full object-contain drop-shadow-md transition-transform duration-300",
                    direction === "left" ? "rotate-90" : "-rotate-90"
                )}
            />

            {/* Arrow Icon */}
            <div className="relative z-10">
                {direction === "left" ? (
                    <ChevronLeft className={cn("w-6 h-6 text-primary", iconClassName)} />
                ) : (
                    <ChevronRight className={cn("w-6 h-6 text-primary", iconClassName)} />
                )}
            </div>
        </button>
    );
});

DiamondArrow.displayName = "DiamondArrow";
