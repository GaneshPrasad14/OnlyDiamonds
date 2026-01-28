import { Outlet } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoldRateButton } from "@/components/ui/GoldRateButton";
import { FloatingActions } from "@/components/ui/FloatingActions";

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <GoldRateButton />
            <FloatingActions />
        </>
    );
};

export default PublicLayout;
