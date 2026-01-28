
import { Shield, RefreshCw, BadgeCheck, Clock, RotateCcw } from "lucide-react";

const stats = [
    {
        icon: BadgeCheck,
        text: "100% Certified",
        color: "text-blue-600",
        bg: "bg-blue-100/50"
    },
    {
        icon: RotateCcw,
        text: "15 Day Return",
        color: "text-rose-600",
        bg: "bg-rose-100/50"
    },
    {
        icon: Shield,
        text: "Lifetime Exchange",
        color: "text-green-600",
        bg: "bg-green-100/50"
    },
    {
        icon: Clock,
        text: "One Year Warranty",
        color: "text-yellow-600",
        bg: "bg-yellow-100/50"
    }
];

const StatsSection = () => {
    return (
        <div className="w-full bg-[#F5F3FF] py-8">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-6 md:gap-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex items-center gap-4 flex-1 justify-center min-w-[200px]">
                            <div className={`p-3 rounded-full ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <span className="font-serif text-primary font-medium text-lg tracking-wide">
                                {stat.text}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StatsSection;
