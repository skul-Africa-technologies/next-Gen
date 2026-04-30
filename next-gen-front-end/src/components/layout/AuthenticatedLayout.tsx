"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated || !isAdmin) {
      router.replace("/admin/login");
    }
  }, [isAuthLoading, isAuthenticated, isAdmin, router]);

  // Show loading state while auth initializes
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 lg:pl-0 pl-20 transition-all duration-300">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
