import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "@/config";
import { toast } from "sonner";

interface User {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    role: "user" | "admin";
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (identifier: string, password: string) => Promise<boolean>;
    register: (name: string, identifier: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in (token in localStorage)
    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data);
            } else {
                // Token invalid or expired
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (identifier: string, password: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role
                });
                toast.success("Welcome back!");
                return true;
            } else {
                toast.error(data.message || "Login failed");
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        }
    };

    const register = async (name: string, identifier: string, password: string) => {
        try {
            // Determine if identifier is email or phone
            const isEmail = identifier.includes("@");
            const payload = {
                name,
                password,
                role: "user",
                [isEmail ? "email" : "phone"]: identifier
            };

            const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                setUser({
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    role: data.role
                });
                toast.success("Account created successfully!");
                return true;
            } else {
                toast.error(data.message || "Registration failed");
                return false;
            }
        } catch (error) {
            toast.error("Something went wrong");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
