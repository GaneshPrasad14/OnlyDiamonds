import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { API_BASE_URL } from "@/config";

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                if (data.role !== 'admin') {
                    toast.error("Access denied. Admin rights required.");
                    setLoading(false);
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.role);
                localStorage.setItem("userName", data.name);

                toast.success("Login successful!");
                navigate("/admin");
            } else {
                toast.error(data.message || "Invalid credentials");
            }
        } catch (error) {
            console.error(error);
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cream/30 px-4">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-brown-deep/10">
                <div className="text-center mb-8">
                    <div className="bg-brown-deep/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-brown-deep" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-brown-deep">Admin Login</h1>
                    <p className="text-muted-foreground mt-2">Secure access for administrators</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <Input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-50 bg-opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-50 bg-opacity-50"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brown-deep hover:bg-brown-deep/90 text-white h-11 text-lg font-medium"
                    >
                        {loading ? "Authenticating..." : "Login to Dashboard"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/" className="text-sm text-brown-deep hover:underline">
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
