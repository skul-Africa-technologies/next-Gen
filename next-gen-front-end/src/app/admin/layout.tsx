import AdminProviders from "@/components/AdminProviders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextGen - Admin Dashboard",
  description: "NextGen Student Platform - Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProviders>
      {children}
    </AdminProviders>
  );
}