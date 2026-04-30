"use client";

import { AuthProvider } from "@/lib/auth-context";
import AuthenticatedLayout from "@/components/layout/AuthenticatedLayout";

export default function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthenticatedLayout>{children}</AuthenticatedLayout>
    </AuthProvider>
  );
}
