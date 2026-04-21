"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      // Allow access to login page without authentication
      if (pathname === "/admin/login") {
        return;
      }

      // Not authenticated - redirect to admin login
      if (!isAuthenticated) {
        router.push(`/admin/login?redirect=${pathname}`);
        return;
      }

      // Authenticated but not admin - redirect to home
      if (isAuthenticated && !isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, pathname, router]);

  // Show nothing while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authorized (except for login page)
  if ((!isAuthenticated || !isAdmin) && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}