"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = async () => {
    setIsAuthLoading(true);
    
    try {
      // Load auth state from localStorage
      const accessToken = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      // If tokens exist, restore user from localStorage
      if (accessToken && storedUser && storedUser !== "undefined") {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Failed to parse user from localStorage:", error);
          localStorage.removeItem("user");
          clearAuth();
        }
      } else {
        // No tokens - clear auth
        clearAuth();
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      clearAuth();
    } finally {
      setIsAuthLoading(false);
      setIsInitialized(true);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    authApi.logout();
    setUser(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const result = await authApi.adminLogin(email, password);

    if (result.success && result.data) {
      return { success: true, message: "Login successful" };
    }

    return { success: false, message: result.message || "Login failed" };
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (_) {
      // Ignore logout errors
    }
    clearAuth();
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading: isAuthLoading || !isInitialized,
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
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
