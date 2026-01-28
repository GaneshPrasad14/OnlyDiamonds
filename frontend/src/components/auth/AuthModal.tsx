import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);

    // Login State
    const [identifier, setIdentifier] = useState(""); // Email or Phone
    const [password, setPassword] = useState("");

    // Register State
    const [regName, setRegName] = useState("");
    const [regIdentifier, setRegIdentifier] = useState("");
    const [regPassword, setRegPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(identifier, password);
        setLoading(false);
        if (success) onClose();
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(regName, regIdentifier, regPassword);
        setLoading(false);
        if (success) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-center font-serif text-2xl text-primary">
                        Welcome to OnlyDiamonds
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Login or create an account to continue
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* LOGIN FORM */}
                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="identifier">Email or Phone Number</Label>
                                <Input
                                    id="identifier"
                                    placeholder="name@example.com or 9876543210"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </form>
                    </TabsContent>

                    {/* REGISTER FORM */}
                    <TabsContent value="register">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="regName">Full Name</Label>
                                <Input
                                    id="regName"
                                    placeholder="Your Name"
                                    value={regName}
                                    onChange={(e) => setRegName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="regIdentifier">Email or Phone Number</Label>
                                <Input
                                    id="regIdentifier"
                                    placeholder="name@example.com or 9876543210"
                                    value={regIdentifier}
                                    onChange={(e) => setRegIdentifier(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="regPassword">Create Password</Label>
                                <Input
                                    id="regPassword"
                                    type="password"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
};
