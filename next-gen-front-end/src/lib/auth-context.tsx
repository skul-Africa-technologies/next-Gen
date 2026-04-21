"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");
    const storedUser = authApi.getCurrentUser();

    if (token && storedUser) {
      setUser(storedUser);
      
      // Try to refresh token if it's about to expire
      const refreshed = await authApi.refreshToken();
      if (!refreshed) {
        // Token refresh failed, logout
        await logout();
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }

    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const result = await authApi.adminLogin(email, password);
    
    if (result.success) {
      setUser(result.data?.user);
      return { success: true, message: 'Login successful' };
    }
    
    return { success: false, message: result.message };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}