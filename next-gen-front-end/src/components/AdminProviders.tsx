"use client";

import { AuthProvider } from "@/lib/auth-context";
import AdminRouteGuard from "@/components/AdminRouteGuard";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminRouteGuard>{children}</AdminRouteGuard>
    </AuthProvider>
  );
}