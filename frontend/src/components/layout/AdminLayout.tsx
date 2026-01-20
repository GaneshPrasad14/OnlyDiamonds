import { useState } from "react";
import { Link, Outlet, useLocation, Navigate, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, PlusCircle, Home, ShoppingBag, FolderTree, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Auth Check
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token || userRole !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        navigate("/admin/login");
    };

    const navItems = [
        {
            title: "Dashboard",
            href: "/admin",
            icon: LayoutDashboard,
        },
        {
            title: "Products",
            href: "/admin/products",
            icon: ShoppingBag,
        },
        {
            title: "Categories",
            href: "/admin/categories",
            icon: FolderTree,
        },
        {
            title: "Add Product",
            href: "/admin/add-product",
            icon: PlusCircle,
        },
        {
            title: "Hero Manager",
            href: "/admin/hero",
            icon: FolderTree,
        },
        {
            title: "Diamond Prices",
            href: "/admin/diamond-prices",
            icon: FolderTree,
        },
        {
            title: "Color Stones",
            href: "/admin/color-stones",
            icon: FolderTree,
        },
        {
            title: "VA & MC",
            href: "/admin/tax-charges",
            icon: FolderTree,
        },
        {
            title: "Back to Home",
            href: "/",
            icon: Home,
        },
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-20 flex items-center px-4 justify-between">
                <h1 className="text-xl font-serif font-bold text-primary">Admin Panel</h1>
                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                    {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-200 ease-in-out lg:transform-none flex flex-col bg-white",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 hidden lg:block">
                    <h1 className="text-2xl font-serif font-bold text-primary">Admin Panel</h1>
                </div>
                <div className="p-6 lg:hidden flex justify-between items-center bg-gray-50 border-b">
                    <span className="font-bold text-lg text-primary">Menu</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="mt-6 flex-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                "flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors",
                                location.pathname === item.href && "bg-gray-100 text-primary border-r-4 border-primary"
                            )}
                        >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 sticky bottom-0 bg-white">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-6 py-3 text-red-500 hover:bg-red-50 transition-colors rounded-md"
                    >
                        <LogOut className="h-5 w-5 mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto pt-16 lg:pt-0 w-full">
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
